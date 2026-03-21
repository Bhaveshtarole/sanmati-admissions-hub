import { useState } from "react";
import { Users, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/students/FileUpload";
import ManualEntryForm from "@/components/students/ManualEntryForm";
import StudentTable from "@/components/students/StudentTable";
import { useStudentStore } from "@/stores/studentStore";

const Students = () => {
  const { students, addStudent, addStudents, updateStudent, deleteStudent } = useStudentStore();
  const [showUpload, setShowUpload] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Student Data Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">{students.length} students in database</p>
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
        {showUpload && <FileUpload onUpload={(s) => { addStudents(s); setShowUpload(false); }} />}
        {showForm && <ManualEntryForm onAdd={(s) => addStudent(s)} />}
      </div>

      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <StudentTable students={students} onUpdate={updateStudent} onDelete={deleteStudent} />
      </div>
    </div>
  );
};

export default Students;
