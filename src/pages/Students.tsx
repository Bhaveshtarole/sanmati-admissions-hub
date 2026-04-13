import { useState, useEffect, useCallback } from "react";
import { Users, Upload, UserPlus, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/students/FileUpload";
import ManualEntryForm from "@/components/students/ManualEntryForm";
import StudentTable from "@/components/students/StudentTable";
import api from "@/api/client";
import type { StudentSummary, StudentCreate, StudentUpdate } from "@/api/client";
import { toast } from "sonner";

const Students = () => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .getStudents({ limit: 100 })
      .then(setStudents)
      .catch(() => setError("Failed to load students. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = (student: StudentCreate) => {
    api
      .createStudent(student)
      .then((created) => {
        setStudents((prev) => [created, ...prev]);
        setShowForm(false);
        toast.success("Student added successfully");
      })
      .catch((err) => {
        const msg = err?.response?.data?.detail || "Failed to add student";
        toast.error(msg);
      });
  };

  const handleBulkUpload = (rawStudents: StudentCreate[]) => {
    api
      .bulkImportStudents(rawStudents)
      .then((result) => {
        toast.success(`Imported ${result.created} students (${result.skipped} skipped)`);
        setShowUpload(false);
        fetchStudents(); // Reload from backend
      })
      .catch(() => toast.error("Bulk import failed"));
  };

  const handleUpdateStudent = (id: string | number, updates: StudentUpdate) => {
    api
      .updateStudent(Number(id), updates)
      .then((updated) => {
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Student updated");
      })
      .catch(() => toast.error("Failed to update student"));
  };

  const handleDeleteStudent = (id: string | number) => {
    api
      .deleteStudent(Number(id))
      .then(() => {
        setStudents((prev) => prev.filter((s) => s.id !== Number(id)));
        toast.success("Student deleted");
      })
      .catch(() => toast.error("Failed to delete student"));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Student Data Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading..." : `${students.length} students in database`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showUpload ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => { setShowUpload(!showUpload); setShowForm(false); }}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload File
          </Button>
          <Button
            variant={showForm ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => { setShowForm(!showForm); setShowUpload(false); }}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add Manually
          </Button>
        </div>
      </div>

      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        {showUpload && <FileUpload onUpload={handleBulkUpload} />}
        {showForm && <ManualEntryForm onAdd={handleAddStudent} />}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {loading ? (
          <div className="glass-card flex items-center justify-center gap-2 p-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading students…</span>
          </div>
        ) : (
          <StudentTable
            students={students}
            onUpdate={handleUpdateStudent}
            onDelete={handleDeleteStudent}
          />
        )}
      </div>
    </div>
  );
};

export default Students;
