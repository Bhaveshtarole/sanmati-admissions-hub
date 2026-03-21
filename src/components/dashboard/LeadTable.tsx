import { useNavigate } from "react-router-dom";
import type { StudentSummary } from "@/api/client";
import StatusBadge from "./StatusBadge";
import HotLeadBadge from "./HotLeadBadge";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface LeadTableProps {
  students: StudentSummary[];
}

type SortKey = "name" | "lead_score" | "created_at";

const LeadTable = ({ students }: LeadTableProps) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const sorted = [...students].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "lead_score") cmp = a.lead_score - b.lead_score;
    else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return sortAsc ? cmp : -cmp;
  });

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <button
      onClick={() => toggleSort(field)}
      className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-4 py-3 text-left"><SortHeader label="Name" field="name" /></th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Course</th>
              <th className="px-4 py-3 text-left"><SortHeader label="Score" field="lead_score" /></th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Lead</th>
              <th className="px-4 py-3 text-left"><SortHeader label="Date" field="created_at" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr
                key={s.id}
                onClick={() => navigate(`/leads/${s.id}`)}
                className="border-b border-border/30 cursor-pointer transition-colors duration-200 hover:bg-primary/5 opacity-0 animate-fade-up"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "forwards" }}
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{s.phone}</td>
                <td className="px-4 py-3 text-sm text-foreground">{s.course_interest || "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary tabular-nums">
                    {s.lead_score}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={s.lead_status} /></td>
                <td className="px-4 py-3"><HotLeadBadge isHot={s.is_hot_lead} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No leads found matching your filters.
        </div>
      )}
    </div>
  );
};

export default LeadTable;
