import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudentCreate } from "@/api/client";

interface ManualEntryFormProps {
  onAdd: (student: StudentCreate) => void;
}

const BRANCHES = [
  "Engineering - CSE",
  "Engineering - ME",
  "Engineering - CE",
  "Engineering - EE",
  "Engineering - AI&DS",
  "ITI - Fitter",
  "ITI - Electrician",
  "ITI - COPA",
  "Nursing - B.Sc",
  "Nursing - GNM",
  "Nursing - ANM",
];

const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "visit_scheduled", label: "Visit Scheduled" },
  { value: "admitted", label: "Admitted" },
  { value: "not_interested", label: "Not Interested" },
];

const ManualEntryForm = ({ onAdd }: ManualEntryFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cetScore, setCetScore] = useState("");
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [status, setStatus] = useState("new");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phone.trim()) errs.phone = "Phone is required";
    else if (!/^[+]?\d{10,13}$/.test(phone.replace(/\s/g, "")))
      errs.phone = "Enter a valid 10-13 digit phone number";
    if (cetScore && (Number(cetScore) < 0 || Number(cetScore) > 200))
      errs.cetScore = "CET score must be 0-200";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Convert CET score (0-200) to lead_score (0-100) proportionally
    const leadScore = cetScore ? Math.round((Number(cetScore) / 200) * 100) : 0;
    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      course_interest: branch,
      lead_status: status,
      lead_score: leadScore,
    });
    setName("");
    setPhone("");
    setCetScore("");
    setBranch(BRANCHES[0]);
    setStatus("new");
    setErrors({});
  };

  const selectClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
      <h3 className="text-sm font-semibold font-display text-foreground uppercase tracking-wider">Add Student Manually</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cet">CET Score (0-200)</Label>
          <Input
            id="cet"
            type="number"
            min={0}
            max={200}
            value={cetScore}
            onChange={(e) => setCetScore(e.target.value)}
            placeholder="0-200"
          />
          {errors.cetScore && <p className="text-xs text-destructive">{errors.cetScore}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="branch">Branch Interest</Label>
          <select id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} className={selectClass}>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" className="gap-1.5">
        <UserPlus className="h-3.5 w-3.5" />
        Save Student
      </Button>
    </form>
  );
};

export default ManualEntryForm;
