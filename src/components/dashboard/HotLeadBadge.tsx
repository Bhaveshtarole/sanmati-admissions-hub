import { Flame } from "lucide-react";

interface HotLeadBadgeProps {
  isHot: boolean;
}

const HotLeadBadge = ({ isHot }: HotLeadBadgeProps) => {
  if (!isHot) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-hot/15 border border-hot/30 px-2 py-0.5 text-xs font-medium text-hot">
      <Flame className="h-3 w-3" />
      Hot
    </span>
  );
};

export default HotLeadBadge;
