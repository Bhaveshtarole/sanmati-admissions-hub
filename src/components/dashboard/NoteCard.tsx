import type { Note } from "@/api/client";

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  const date = new Date(note.created_at).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="glass-card p-4 space-y-2">
      <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-primary/80">{note.counselor_name}</span>
        <span>{date}</span>
      </div>
    </div>
  );
};

export default NoteCard;
