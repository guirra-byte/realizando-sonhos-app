import { Badge } from "@/components/ui/badge";

type BadgeType = "success" | "warning" | "danger" | "info";

const badgeStyles: Record<BadgeType, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
};

interface StatusBadgeProps {
  type: BadgeType;
  children: React.ReactNode;
}

export function StatusBadge({ type, children }: StatusBadgeProps) {
  return <Badge className={badgeStyles[type]}>{children}</Badge>;
}
