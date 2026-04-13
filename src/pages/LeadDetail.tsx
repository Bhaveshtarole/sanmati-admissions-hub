import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Phone, BookOpen, TrendingUp,
  MessageSquare, StickyNote, Loader2, AlertCircle,
} from "lucide-react";
import type { StudentDetail as StudentDetailType, Note } from "@/api/client";
import StatusBadge from "@/components/dashboard/StatusBadge";
import HotLeadBadge from "@/components/dashboard/HotLeadBadge";
import ChatBubble from "@/components/dashboard/ChatBubble";
import NoteCard from "@/components/dashboard/NoteCard";
import NoteForm from "@/components/dashboard/NoteForm";
import { Button } from "@/components/ui/button";
import api from "@/api/client";
import { toast } from "sonner";

const STATUSES = ["new", "in_progress", "visit_scheduled", "admitted", "not_interested"];

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = Number(id);

  const [student, setStudent] = useState<StudentDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getStudent(studentId)
      .then(setStudent)
      .catch(() => setError("Failed to load student. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleStatusChange = (newStatus: string) => {
    if (!student) return;
    setStatusSaving(true);
    api
      .updateStatus(studentId, newStatus)
      .then(() => {
        setStudent((prev) => prev ? { ...prev, lead_status: newStatus } : prev);
        toast.success("Status updated");
      })
      .catch(() => toast.error("Failed to update status"))
      .finally(() => setStatusSaving(false));
  };

  const handleAddNote = (content: string, counselorName: string) => {
    api
      .addNote(studentId, content, counselorName)
      .then((newNote: Note) => {
        setStudent((prev) =>
          prev ? { ...prev, notes: [newNote, ...prev.notes] } : prev
        );
        toast.success("Note added");
      })
      .catch(() => toast.error("Failed to add note"));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading student…</span>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/leads")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error || "Student not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/leads")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">{student.name || student.phone}</h1>
          <p className="text-sm text-muted-foreground">Lead #{student.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="glass-card p-6 space-y-5 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-foreground">{student.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{student.course_interest || "Undecided"}</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary tabular-nums">
                Score: {student.lead_score}
              </span>
            </div>
            <HotLeadBadge isHot={student.is_hot_lead} />
          </div>

          {/* Status selector */}
          <div className="space-y-2 pt-2 border-t border-border/50">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
            <select
              value={student.lead_status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={statusSaving}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-60"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
            <StatusBadge status={student.lead_status} />
          </div>
        </div>

        {/* Chat transcript */}
        <div className="glass-card p-6 lg:col-span-2 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp Transcript</h2>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {student.interactions.length > 0 ? (
              student.interactions.map((interaction) => (
                <ChatBubble
                  key={interaction.id}
                  message={interaction.message ?? ""}
                  response={interaction.response ?? ""}
                  timestamp={interaction.timestamp}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No interactions recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes section */}
      <div className="glass-card p-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 mb-4">
          <StickyNote className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Counselor Notes</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {student.notes.length > 0 ? (
              student.notes.map((note) => <NoteCard key={note.id} note={note} />)
            ) : (
              <p className="text-sm text-muted-foreground py-4">No notes yet. Add one below.</p>
            )}
          </div>
          <div>
            <NoteForm onSubmit={handleAddNote} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
