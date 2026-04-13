import { useState, useEffect } from "react";
import { Send, MessageSquare, Clock, Users, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import api from "@/api/client";
import type { CampaignResponse } from "@/api/client";
import { toast } from "sonner";
import { format } from "date-fns";

const RECIPIENT_GROUPS = [
  { value: "all", label: "All Students" },
  { value: "interested", label: "Interested Students" },
  { value: "high_cet", label: "High Score Students (≥80%)" },
];

const CampaignManager = () => {
  const [message, setMessage] = useState("");
  const [recipientGroup, setRecipientGroup] = useState("all");
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingHistory(true);
    api
      .getCampaigns()
      .then(setCampaigns)
      .catch(() => setError("Failed to load campaign history. Is the backend running?"))
      .finally(() => setLoadingHistory(false));
  }, []);

  const handleSend = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    api
      .createCampaign(message.trim(), recipientGroup)
      .then((newCampaign) => {
        setCampaigns((prev) => [newCampaign, ...prev]);
        setMessage("");
        toast.success(`Campaign queued for ${newCampaign.recipient_count} recipients`);
      })
      .catch(() => toast.error("Failed to send campaign"))
      .finally(() => setSending(false));
  };

  const selectClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const groupLabel = (group: string) =>
    RECIPIENT_GROUPS.find((g) => g.value === group)?.label || group;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Campaign Manager</h1>
        <p className="mt-1 text-sm text-muted-foreground">Send WhatsApp template messages to student groups</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

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
            placeholder="Hello {{name}}, thank you for your interest in {{branch}} at Sanmati College. Your score qualifies you for..."
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
              <span className="text-xs text-muted-foreground italic">Counted on send</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSend}
          className="gap-1.5"
          disabled={!message.trim() || sending}
        >
          {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {sending ? "Sending…" : "Send WhatsApp Template"}
        </Button>
      </div>

      {/* Campaign History */}
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
        <h2 className="text-sm font-semibold font-display text-foreground uppercase tracking-wider flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-primary" />
          Campaign History
        </h2>
        {loadingHistory ? (
          <div className="glass-card flex items-center justify-center gap-2 p-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading campaigns…</span>
          </div>
        ) : campaigns.length === 0 ? (
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
                    <span>{groupLabel(c.recipient_group)}</span>
                    <span>•</span>
                    <span>{c.recipient_count} recipients</span>
                    <span>•</span>
                    <span>{format(new Date(c.sent_at), "MMM d, yyyy h:mm a")}</span>
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
