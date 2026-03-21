from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class NoteCreate(BaseModel):
    content: str
    counselor_name: str


class NoteResponse(BaseModel):
    id: int
    student_id: int
    content: str
    counselor_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    lead_status: str


class InteractionResponse(BaseModel):
    id: int
    student_id: int
    message: str
    response: str
    timestamp: datetime

    class Config:
        from_attributes = True


class StudentSummary(BaseModel):
    id: int
    name: str
    phone: str
    course_interest: Optional[str] = None
    lead_score: float
    is_hot_lead: bool
    lead_status: str
    created_at: datetime

    class Config:
        from_attributes = True


class StudentDetail(StudentSummary):
    interactions: List[InteractionResponse] = []
    notes: List[NoteResponse] = []


class StatsResponse(BaseModel):
    total_leads: int
    hot_leads: int
    admitted: int
    avg_score: float
    status_breakdown: dict
