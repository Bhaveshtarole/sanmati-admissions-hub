// Mock data for frontend preview when backend is not running
import type { Stats, StudentSummary, StudentDetail } from "@/api/client";

export const mockStats: Stats = {
  total_leads: 347,
  hot_leads: 42,
  admitted: 89,
  avg_score: 72.4,
  status_breakdown: {
    new: 128,
    in_progress: 87,
    visit_scheduled: 43,
    admitted: 89,
    not_interested: 0,
  },
};

const courses = ["BCA", "BBA", "B.Com", "BSc IT", "MCA", "MBA"];
const statuses = ["new", "in_progress", "visit_scheduled", "admitted", "not_interested"] as const;
const names = [
  "Priya Sharma", "Rahul Patel", "Ananya Gupta", "Vikram Singh", "Sneha Desai",
  "Arjun Mehta", "Kavita Nair", "Rohit Joshi", "Meera Kulkarni", "Aditya Rao",
  "Pooja Verma", "Karan Malhotra", "Divya Iyer", "Nikhil Reddy", "Swati Bose",
  "Amit Choudhary", "Riya Kapoor", "Suresh Pillai", "Neha Agarwal", "Deepak Tiwari",
];

export const mockStudents: StudentSummary[] = names.map((name, i) => ({
  id: i + 1,
  name,
  phone: `+91 ${9800000000 + i * 1117}`,
  course_interest: courses[i % courses.length],
  lead_score: Math.round((40 + Math.random() * 55) * 10) / 10,
  is_hot_lead: i < 5 || i === 8 || i === 12,
  lead_status: statuses[i % statuses.length],
  created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
}));

export const mockStudentDetail = (id: number): StudentDetail => {
  const s = mockStudents.find((s) => s.id === id) || mockStudents[0];
  return {
    ...s,
    interactions: [
      { id: 1, student_id: s.id, message: "Hi, I want to know about BCA admission", response: "Welcome to Sanmati College! Our BCA program is a 3-year course. Would you like to know about eligibility and fees?", timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 2, student_id: s.id, message: "Yes, tell me about fees", response: "BCA annual fees are ₹45,000. We also offer merit scholarships up to 30%. Shall I schedule a campus visit?", timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 3, student_id: s.id, message: "Sure, when can I visit?", response: "You can visit Mon-Sat, 10 AM - 4 PM. I'll schedule you for this Saturday at 11 AM. Please bring your 12th marksheet.", timestamp: new Date(Date.now() - 86400000).toISOString() },
    ],
    notes: [
      { id: 1, student_id: s.id, content: "Student seems very interested. Parents supportive of BCA choice.", counselor_name: "Dr. Patil", created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 2, student_id: s.id, content: "Follow-up call done. Visit confirmed for Saturday.", counselor_name: "Mrs. Deshmukh", created_at: new Date(Date.now() - 43200000).toISOString() },
    ],
  };
};
