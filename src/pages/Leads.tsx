import { useState, useMemo } from "react";
import { Search, Download, Filter } from "lucide-react";
import LeadTable from "@/components/dashboard/LeadTable";
import { mockStudents } from "@/data/mockData";
import type { StudentSummary } from "@/api/client";
import { Button } from "@/components/ui/button";
import api from "@/api/client";

const statuses = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "visit_scheduled", label: "Visit Scheduled" },
  { value: "admitted", label: "Admitted" },
  { value: "not_interested", label: "Not Interested" },
];

const courses = ["", "BCA", "BBA", "B.Com", "BSc IT", "MCA", "MBA"];

const Leads = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [hotOnly, setHotOnly] = useState(false);
  const [students] = useState<StudentSummary[]>(mockStudents);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (statusFilter && s.lead_status !== statusFilter) return false;
      if (courseFilter && s.course_interest !== courseFilter) return false;
      if (hotOnly && !s.is_hot_lead) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.phone.includes(q)) return false;
      }
      return true;
    });
  }, [students, search, statusFilter, courseFilter, hotOnly]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} students found</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-border/60 text-muted-foreground hover:text-foreground"
          onClick={() => window.open(api.exportCsv(), "_blank")}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">All Courses</option>
          {courses.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => setHotOnly(!hotOnly)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
            hotOnly
              ? "border-hot/40 bg-hot/15 text-hot"
              : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          🔥 Hot Only
        </button>
      </div>

      <LeadTable students={filtered} />
    </div>
  );
};

export default Leads;
