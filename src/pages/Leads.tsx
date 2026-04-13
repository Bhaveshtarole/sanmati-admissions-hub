import { useState, useEffect, useCallback } from "react";
import { Search, Download, Filter, Loader2, AlertCircle } from "lucide-react";
import LeadTable from "@/components/dashboard/LeadTable";
import type { StudentSummary } from "@/api/client";
import { Button } from "@/components/ui/button";
import api from "@/api/client";
import { useDebounce } from "@/hooks/useDebounce";

const statuses = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "visit_scheduled", label: "Visit Scheduled" },
  { value: "admitted", label: "Admitted" },
  { value: "not_interested", label: "Not Interested" },
];

const courses = [
  "",
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

const Leads = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [hotOnly, setHotOnly] = useState(false);
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const fetchStudents = useCallback(() => {
    setLoading(true);
    setError(null);

    const params: Record<string, string | number | boolean> = { page, limit: 50 };
    if (statusFilter) params.status = statusFilter;
    if (courseFilter) params.course = courseFilter;
    if (hotOnly) params.is_hot_lead = true;
    if (debouncedSearch) params.search = debouncedSearch;

    api
      .getStudents(params)
      .then(setStudents)
      .catch(() => setError("Failed to load students. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [statusFilter, courseFilter, hotOnly, debouncedSearch, page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, courseFilter, hotOnly, debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading..." : `${students.length} students found`}
          </p>
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

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="glass-card flex items-center justify-center gap-2 p-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading students…</span>
        </div>
      ) : (
        <>
          <LeadTable students={students} />
          {students.length === 50 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)}>
                  ← Previous
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)}>
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leads;
