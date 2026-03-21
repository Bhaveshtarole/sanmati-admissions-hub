import { useState } from "react";
import { Send, MessageSquare, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useStudentStore } from "@/stores/studentStore";
import { toast } from "sonner";
import { format } from "date-fns";

const RECIPIENT_GROUPS = [
  { value: "all", label: "All Students" },
  { value: "interested", label: "Interested Students" },
  { value: "high_cet", label: "High CET Score Students (120+)" },
];

const CampaignManager = () => {
  const { students, campaigns, addCampaign } = useStudentStore();
  const [message, setMessage] = useState("");
  const [recipientGroup, setRecipientGroup] = useState("all");

  const getRecipientCount = () => {
    if (recipientGroup === "all") return students.length;
    if (recipientGroup === "interested") return students.filter((s) => s.status === "Interested").length;
    if (recipientGroup === "high_cet") return students.filter((s) => s.cetScore >= 120).length;
    return 0;
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    const count = getRecipientCount();
    if (count === 0) {
      toast.error("No recipients in selected group");
      return;
    }
    addCampaign({
      message: message.trim(),
      recipientGroup: RECIPIENT_GROUPS.find((g) => g.value === recipientGroup)?.label || recipientGroup,
      recipientCount: count,
    });
    setMessage("");
    toast.success(`Campaign queued for ${count} recipients`);
  };

  const selectClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Campaign Manager</h1>
        <p className="mt-1 text-sm text-muted-foreground">Send WhatsApp template messages to student groups</p>
      </div>

      {/* Composer */}
      <div className="glass-card p-6 space-y-4 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h2 className="text-sm font-semibold font-display text-foreground uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Message Composer
        </h2>
        <div className="space-y-1.5">
          <Label>Message Template</Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hello {{name}}, thank you for your interest in {{branch}} at Sanmati College. Your CET score of {{cet_score}} qualifies you for..."
            rows={5}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Recipient Group</Label>
            <select value={recipientGroup} onChange={(e) => setRecipientGroup(e.target.value)} className={selectClass}>
              {RECIPIENT_GROUPS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="glass-card p-3 w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Recipients
              </div>
              <span className="text-lg font-bold tabular-nums text-foreground">{getRecipientCount()}</span>
            </div>
          </div>
        </div>
        <Button onClick={handleSend} className="gap-1.5" disabled={!message.trim() || getRecipientCount() === 0}>
          <Send className="h-3.5 w-3.5" />
          Send WhatsApp Template
        </Button>
      </div>

      {/* Campaign History */}
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
        <h2 className="text-sm font-semibold font-display text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          Campaign History
        </h2>
        {campaigns.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No campaigns sent yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Compose a message above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="glass-card p-4 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Send className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">{c.message}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{c.recipientGroup}</span>
                    <span>•</span>
                    <span>{c.recipientCount} recipients</span>
                    <span>•</span>
                    <span>{format(new Date(c.sentAt), "MMM d, yyyy h:mm a")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignManager;
