import csv
import io
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student, Interaction, LeadNote
from app.schemas import (
    StudentSummary,
    StudentDetail,
    StatsResponse,
    NoteCreate,
    NoteResponse,
    StatusUpdate,
)

router = APIRouter()

VALID_STATUSES = {"new", "in_progress", "visit_scheduled", "admitted", "not_interested"}


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Student).count()
    hot = db.query(Student).filter(Student.is_hot_lead == True).count()
    admitted = db.query(Student).filter(Student.lead_status == "admitted").count()
    avg = db.query(func.avg(Student.lead_score)).scalar() or 0.0

    breakdown = {}
    for status in VALID_STATUSES:
        breakdown[status] = db.query(Student).filter(Student.lead_status == status).count()

    return StatsResponse(
        total_leads=total,
        hot_leads=hot,
        admitted=admitted,
        avg_score=round(float(avg), 1),
        status_breakdown=breakdown,
    )


@router.get("/students", response_model=list[StudentSummary])
def list_students(
    status: Optional[str] = None,
    course: Optional[str] = None,
    is_hot_lead: Optional[bool] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Student)
    if status:
        q = q.filter(Student.lead_status == status)
    if course:
        q = q.filter(Student.course_interest == course)
    if is_hot_lead is not None:
        q = q.filter(Student.is_hot_lead == is_hot_lead)
    if search:
        q = q.filter(
            Student.name.ilike(f"%{search}%") | Student.phone.ilike(f"%{search}%")
        )
    return q.order_by(Student.created_at.desc()).offset((page - 1) * limit).limit(limit).all()


@router.get("/students/export")
def export_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Phone", "Course", "Score", "Hot Lead", "Status", "Created"])
    for s in students:
        writer.writerow([s.id, s.name, s.phone, s.course_interest, s.lead_score, s.is_hot_lead, s.lead_status, s.created_at])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students_export.csv"},
    )


@router.get("/students/{student_id}", response_model=StudentDetail)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    interactions = db.query(Interaction).filter(Interaction.student_id == student_id).order_by(Interaction.timestamp).all()
    notes = db.query(LeadNote).filter(LeadNote.student_id == student_id).order_by(LeadNote.created_at.desc()).all()
    return StudentDetail(
        **{c.name: getattr(student, c.name) for c in Student.__table__.columns},
        interactions=interactions,
        notes=notes,
    )


@router.put("/students/{student_id}/status")
def update_status(student_id: int, body: StatusUpdate, db: Session = Depends(get_db)):
    if body.lead_status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.lead_status = body.lead_status
    db.commit()
    return {"message": "Status updated"}


@router.post("/students/{student_id}/notes", response_model=NoteResponse)
def add_note(student_id: int, body: NoteCreate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    note = LeadNote(student_id=student_id, content=body.content, counselor_name=body.counselor_name)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
