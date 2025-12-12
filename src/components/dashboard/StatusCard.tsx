import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status?: "online" | "offline" | "warning" | "neutral";
  subtitle?: string;
}

export const StatusCard = ({ title, value, icon: Icon, status = "neutral", subtitle }: StatusCardProps) => {
  const statusColors = {
    online: "border-success/30 bg-success/5",
    offline: "border-destructive/30 bg-destructive/5",
    warning: "border-yellow-500/30 bg-yellow-500/5",
    neutral: "border-border/50",
  };

  const iconColors = {
    online: "text-success",
    offline: "text-destructive",
    warning: "text-yellow-500",
    neutral: "text-secondary",
  };

  const valueColors = {
    online: "text-success",
    offline: "text-destructive",
    warning: "text-yellow-500",
    neutral: "text-primary",
  };

  return (
    <div className={cn(
      "card-base p-4 transition-all duration-300 hover:scale-[1.02]",
      statusColors[status]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className={cn("metric-value mt-1", valueColors[status])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg bg-muted/50",
          iconColors[status]
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      {status !== "neutral" && (
        <div className="flex items-center gap-2 mt-3">
          <span className={cn("status-indicator", `status-${status === "warning" ? "online" : status}`)} />
          <span className="text-xs text-muted-foreground capitalize">{status}</span>
        </div>
      )}
    </div>
  );
};
