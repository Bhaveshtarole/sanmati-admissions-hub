const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-status-new/15 text-status-new border-status-new/30" },
  in_progress: { label: "In Progress", className: "bg-status-in-progress/15 text-status-in-progress border-status-in-progress/30" },
  visit_scheduled: { label: "Visit Scheduled", className: "bg-status-visit/15 text-status-visit border-status-visit/30" },
  admitted: { label: "Admitted", className: "bg-status-admitted/15 text-status-admitted border-status-admitted/30" },
  not_interested: { label: "Not Interested", className: "bg-status-not-interested/15 text-status-not-interested border-status-not-interested/30" },
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
export { statusConfig };
