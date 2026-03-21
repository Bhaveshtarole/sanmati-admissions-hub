import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface NoteFormProps {
  onSubmit: (content: string, counselorName: string) => void;
  isLoading?: boolean;
}

const NoteForm = ({ onSubmit, isLoading }: NoteFormProps) => {
  const [content, setContent] = useState("");
  const [counselorName, setCounselorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !counselorName.trim()) return;
    onSubmit(content.trim(), counselorName.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your name"
        value={counselorName}
        onChange={(e) => setCounselorName(e.target.value)}
        className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
      <textarea
        placeholder="Add a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
      />
      <Button
        type="submit"
        disabled={!content.trim() || !counselorName.trim() || isLoading}
        className="w-full gap-2"
        size="sm"
      >
        <Send className="h-3.5 w-3.5" />
        Add Note
      </Button>
    </form>
  );
};

export default NoteForm;
