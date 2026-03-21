import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  delay?: number;
}

const StatCard = ({ title, value, icon, trend, delay = 0 }: StatCardProps) => {
  return (
    <div
      className="glass-card-hover gradient-border stat-glow p-6 opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold font-display gradient-text tabular-nums">
            {value}
          </p>
          {trend && (
            <p className="text-xs text-primary/70">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
