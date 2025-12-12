import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CostCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  highlight?: boolean;
}

export const CostCard = ({ title, value, icon: Icon, trend = "neutral", trendValue, highlight = false }: CostCardProps) => {
  const trendColors = {
    up: "text-destructive",
    down: "text-success",
    neutral: "text-muted-foreground",
  };

  return (
    <div className={cn(
      "card-base p-5 transition-all duration-300 hover:glow-primary",
      highlight && "border-primary/50 glow-primary"
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
      </div>
      
      <p className={cn(
        "font-mono text-2xl font-bold tracking-tight",
        highlight ? "text-primary" : "text-foreground"
      )}>
        {value}
      </p>
      
      {trendValue && (
        <div className="flex items-center gap-1 mt-2">
          <span className={cn("text-xs font-medium", trendColors[trend])}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trendValue}
          </span>
          <span className="text-xs text-muted-foreground">vs ontem</span>
        </div>
      )}
    </div>
  );
};
