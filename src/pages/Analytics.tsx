import { BarChart3 } from "lucide-react";

const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Detailed admission analytics and reports</p>
    </div>
    <div className="glass-card p-16 text-center opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
      <BarChart3 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-sm font-medium text-muted-foreground">Analytics module coming soon</p>
      <p className="text-xs text-muted-foreground/70 mt-1">Conversion funnels, trend analysis, and campaign ROI</p>
    </div>
  </div>
);

export default Analytics;
