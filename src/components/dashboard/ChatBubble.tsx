interface ChatBubbleProps {
  message: string;
  response: string;
  timestamp: string;
}

const ChatBubble = ({ message, response, timestamp }: ChatBubbleProps) => {
  const time = new Date(timestamp).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="space-y-3">
      {/* Student message */}
      <div className="flex justify-end">
        <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-primary/20 border border-primary/20 px-4 py-2.5">
          <p className="text-sm text-foreground">{message}</p>
          <p className="mt-1 text-[10px] text-muted-foreground text-right">{time}</p>
        </div>
      </div>
      {/* Bot response */}
      <div className="flex justify-start">
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-secondary border border-border px-4 py-2.5">
          <p className="text-sm text-foreground">{response}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
