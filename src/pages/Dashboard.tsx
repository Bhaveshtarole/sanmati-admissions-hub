import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, Flame, GraduationCap, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { mockStats, mockStudents } from "@/data/mockData";
import type { Stats } from "@/api/client";

const STATUS_COLORS: Record<string, string> = {
  new: "hsl(217, 91%, 60%)",
  in_progress: "hsl(45, 93%, 47%)",
  visit_scheduled: "hsl(262, 83%, 58%)",
  admitted: "hsl(142, 71%, 45%)",
  not_interested: "hsl(0, 0%, 45%)",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  visit_scheduled: "Visit Scheduled",
  admitted: "Admitted",
  not_interested: "Not Interested",
};

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>(mockStats);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setStats)
      .catch(() => setStats(mockStats));
  }, []);

  const pieData = Object.entries(stats.status_breakdown).map(([key, value]) => ({
    name: STATUS_LABELS[key] || key,
    value,
    color: STATUS_COLORS[key] || "#666",
  }));

  const BRANCH_COLORS = [
    "hsl(200, 80%, 44%)", "hsl(142, 71%, 45%)", "hsl(45, 93%, 47%)",
    "hsl(262, 83%, 58%)", "hsl(0, 72%, 51%)", "hsl(180, 60%, 40%)",
  ];

  const courseMap: Record<string, number> = {};
  mockStudents.forEach((s) => {
    const c = s.course_interest || "Unknown";
    courseMap[c] = (courseMap[c] || 0) + 1;
  });
  const barData = Object.entries(courseMap).map(([name, count]) => ({ name, count }));
  const branchPieData = Object.entries(courseMap).map(([name, count], i) => ({
    name,
    count,
    color: BRANCH_COLORS[i % BRANCH_COLORS.length],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground text-balance">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Admission pipeline overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={stats.total_leads} icon={<Users className="h-5 w-5" />} delay={0} />
        <StatCard title="Hot Leads" value={stats.hot_leads} icon={<Flame className="h-5 w-5" />} delay={80} />
        <StatCard title="Admitted" value={stats.admitted} icon={<GraduationCap className="h-5 w-5" />} delay={160} />
        <StatCard title="Avg Score" value={stats.avg_score} icon={<TrendingUp className="h-5 w-5" />} delay={240} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <h2 className="text-sm font-semibold font-display text-foreground mb-4 uppercase tracking-wider">Lead Status Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    color: "hsl(220, 15%, 15%)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 justify-center">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <h2 className="text-sm font-semibold font-display text-foreground mb-4 uppercase tracking-wider">Students by Branch</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={branchPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                  strokeWidth={0}
                >
                  {branchPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    color: "hsl(220, 15%, 15%)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 justify-center">
            {branchPieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.count})
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 opacity-0 animate-fade-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
          <h2 className="text-sm font-semibold font-display text-foreground mb-4 uppercase tracking-wider">Students per Branch</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 10 }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={50} />
                <YAxis tick={{ fill: "hsl(220, 9%, 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "8px",
                    color: "hsl(220, 15%, 15%)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(200, 80%, 44%)" />
                    <stop offset="100%" stopColor="hsl(220, 70%, 50%)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
