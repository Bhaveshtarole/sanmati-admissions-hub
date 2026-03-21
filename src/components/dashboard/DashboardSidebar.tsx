import { NavLink as RouterNavLink } from "react-router-dom";
import { LayoutDashboard, Users, GraduationCap, UserPlus, Send, BarChart3, Settings } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/students", label: "Students", icon: UserPlus },
  { to: "/campaigns", label: "Campaign Manager", icon: Send },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

const DashboardSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/50 bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-bold font-display text-foreground">Sanmati College</h1>
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Admissions CRM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </RouterNavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-4">
        <div className="glass-card p-3 text-center">
          <p className="text-[10px] text-muted-foreground">WhatsApp Bot</p>
          <p className="text-xs font-medium text-status-admitted flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-status-admitted animate-pulse" />
            Online
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
