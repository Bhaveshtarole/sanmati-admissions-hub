import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

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
  message: string;
  response: string;
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
}

export const api = {
  getStats: () => client.get<Stats>("/api/stats").then((r) => r.data),
  getStudents: (params?: Record<string, string | number | boolean>) =>
    client.get<StudentSummary[]>("/api/students", { params }).then((r) => r.data),
  getStudent: (id: number) =>
    client.get<StudentDetail>(`/api/students/${id}`).then((r) => r.data),
  updateStatus: (id: number, lead_status: string) =>
    client.put(`/api/students/${id}/status`, { lead_status }),
  addNote: (id: number, content: string, counselor_name: string) =>
    client.post<Note>(`/api/students/${id}/notes`, { content, counselor_name }).then((r) => r.data),
  exportCsv: () => `${API_BASE}/api/students/export`,
};

export default api;
