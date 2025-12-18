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
      "card-base p-4 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-full",
      statusColors[status]
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0"> {/* min-w-0 ajuda no truncamento e quebra */}
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className={cn(
            "mt-1 font-mono font-bold tracking-tight break-words leading-tight",
            title === "Mailing" ? "text-sm" : "text-2xl", // Fonte menor para o nome do mailing
            valueColors[status]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2 rounded-lg bg-muted/50 shrink-0",
          iconColors[status]
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      {status !== "neutral" && (
        <div className="flex items-center gap-2 mt-3">
          <span className={cn("status-indicator", `status-${status === "warning" ? "online" : status}`)} />
          <span className="text-[10px] text-muted-foreground capitalize font-medium">{status}</span>
        </div>
      )}
    </div>
  );
};
