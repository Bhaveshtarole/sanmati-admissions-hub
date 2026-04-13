import { useState, useMemo } from "react";
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StudentSummary, StudentUpdate } from "@/api/client";

interface StudentTableProps {
  students: StudentSummary[];
  onUpdate: (id: number, updates: StudentUpdate) => void;
  onDelete: (id: number) => void;
}

const PAGE_SIZE = 10;

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

const LEAD_STATUSES = ["new", "in_progress", "visit_scheduled", "admitted", "not_interested"];

const statusColor: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  visit_scheduled: "bg-purple-100 text-purple-700",
  admitted: "bg-green-100 text-green-700",
  not_interested: "bg-gray-100 text-gray-600",
};

const StudentTable = ({ students, onUpdate, onDelete }: StudentTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<StudentUpdate>({});

  const filtered = useMemo(() => {
    let list = students;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(q) ||
          s.phone.includes(q)
      );
    }
    list = [...list].sort((a, b) =>
      sortAsc ? a.lead_score - b.lead_score : b.lead_score - a.lead_score
    );
    return list;
  }, [students, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startEdit = (s: StudentSummary) => {
    setEditingId(s.id);
    setEditData({
      name: s.name || "",
      phone: s.phone,
      course_interest: s.course_interest || "",
      lead_status: s.lead_status,
      lead_score: s.lead_score,
    });
  };

  const saveEdit = () => {
    if (editingId !== null) {
      onUpdate(editingId, editData);
      setEditingId(null);
    }
  };

  const selectClass =
    "rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} students</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <button onClick={() => setSortAsc(!sortAsc)} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    Score <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paged.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No students yet — upload a file or add manually above.
                  </td>
                </tr>
              )}
              {paged.map((s) =>
                editingId === s.id ? (
                  <tr key={s.id} className="bg-primary/5">
                    <td className="px-4 py-2">
                      <Input value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="h-8" />
                    </td>
                    <td className="px-4 py-2">
                      <Input value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="h-8" />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        value={editData.lead_score ?? 0}
                        onChange={(e) => setEditData({ ...editData, lead_score: Number(e.target.value) })}
                        className="h-8 w-20"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={editData.course_interest || ""}
                        onChange={(e) => setEditData({ ...editData, course_interest: e.target.value })}
                        className={selectClass}
                      >
                        {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={editData.lead_status || "new"}
                        onChange={(e) => setEditData({ ...editData, lead_status: e.target.value })}
                        className={selectClass}
                      >
                        {LEAD_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-right space-x-1">
                      <Button size="sm" variant="default" onClick={saveEdit} className="h-7 text-xs">Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs">Cancel</Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={s.id} className="hover:bg-secondary/30 transition-colors duration-150">
                    <td className="px-4 py-3 font-medium text-foreground">{s.name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.phone}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{s.lead_score}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.course_interest || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[s.lead_status] || "bg-muted text-muted-foreground"}`}>
                        {s.lead_status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => startEdit(s)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors active:scale-95"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(s.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors active:scale-95"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page <= 1} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
