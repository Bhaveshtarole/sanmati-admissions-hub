import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Shared Types ──────────────────────────────────────────────────────

export interface StudentSummary {
  id: number;
  name: string;
  phone: string;
  course_interest: string | null;
  lead_score: number;
  is_hot_lead: boolean;
  lead_status: string;
  created_at: string;
}

export interface Interaction {
  id: number;
  student_id: number;
  message: string | null;
  response: string | null;
  timestamp: string;
}

export interface Note {
  id: number;
  student_id: number;
  content: string;
  counselor_name: string;
  created_at: string;
}

export interface StudentDetail extends StudentSummary {
  interactions: Interaction[];
  notes: Note[];
}

export interface Stats {
  total_leads: number;
  hot_leads: number;
  admitted: number;
  avg_score: number;
  status_breakdown: Record<string, number>;
  course_breakdown: Record<string, number>;
}

export interface StudentCreate {
  name: string;
  phone: string;
  course_interest?: string;
  lead_status?: string;
  lead_score?: number;
}

export interface StudentUpdate {
  name?: string;
  phone?: string;
  course_interest?: string;
  lead_status?: string;
  lead_score?: number;
}

export interface CampaignResponse {
  id: number;
  message: string;
  recipient_group: string;
  recipient_count: number;
  sent_at: string;
}

// ── API Methods ───────────────────────────────────────────────────────

export const api = {
  // ── Stats ────────────────────────────────────────────────────────
  getStats: () =>
    client.get<Stats>("/api/stats").then((r) => r.data),

  // ── Students ─────────────────────────────────────────────────────
  getStudents: (params?: Record<string, string | number | boolean>) =>
    client.get<StudentSummary[]>("/api/students", { params }).then((r) => r.data),

  getStudent: (id: number) =>
    client.get<StudentDetail>(`/api/students/${id}`).then((r) => r.data),

  createStudent: (data: StudentCreate) =>
    client.post<StudentSummary>("/api/students", data).then((r) => r.data),

  bulkImportStudents: (students: StudentCreate[]) =>
    client
      .post<{ created: number; skipped: number }>("/api/students/bulk", { students })
      .then((r) => r.data),

  updateStudent: (id: number, data: StudentUpdate) =>
    client.put<StudentSummary>(`/api/students/${id}`, data).then((r) => r.data),

  deleteStudent: (id: number) =>
    client.delete(`/api/students/${id}`).then((r) => r.data),

  updateStatus: (id: number, lead_status: string) =>
    client.put(`/api/students/${id}/status`, { lead_status }),

  addNote: (id: number, content: string, counselor_name: string) =>
    client
      .post<Note>(`/api/students/${id}/notes`, { content, counselor_name })
      .then((r) => r.data),

  exportCsv: () => `${API_BASE}/api/students/export`,

  // ── Campaigns ────────────────────────────────────────────────────
  getCampaigns: () =>
    client.get<CampaignResponse[]>("/api/campaigns").then((r) => r.data),

  createCampaign: (message: string, recipient_group: string) =>
    client
      .post<CampaignResponse>("/api/campaigns", { message, recipient_group })
      .then((r) => r.data),
};

export default api;
