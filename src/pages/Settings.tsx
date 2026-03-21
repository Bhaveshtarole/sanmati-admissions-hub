import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your dashboard preferences</p>
    </div>
    <div className="glass-card p-16 text-center opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
      <SettingsIcon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
      <p className="text-sm font-medium text-muted-foreground">Settings panel coming soon</p>
      <p className="text-xs text-muted-foreground/70 mt-1">WhatsApp bot config, user management, and notifications</p>
    </div>
  </div>
);

export default Settings;
