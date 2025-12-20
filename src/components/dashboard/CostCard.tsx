import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CostCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  highlight?: boolean;
  colorVariant?: "primary" | "alert" | "secondary";
  subtitle?: string;
}

export const CostCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend = "neutral", 
  trendValue, 
  highlight = false,
  colorVariant = "primary",
  subtitle
}: CostCardProps) => {
  const trendColors = {
    up: "text-destructive",
    down: "text-success",
    neutral: "text-muted-foreground",
  };

  const variantColors = {
    primary: "text-primary",
    alert: "text-secondary",
    secondary: "text-muted-foreground",
  };

  const iconBgColors = {
    primary: "bg-primary/10",
    alert: "bg-secondary/10",
    secondary: "bg-muted/30",
  };

  const iconTextColors = {
    primary: "text-primary",
    alert: "text-secondary",
    secondary: "text-muted-foreground",
  };

  return (
    <div className={cn(
      "rounded-lg border-2 border-primary/40 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:border-primary",
      highlight && "border-primary shadow-md"
    )}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2 rounded-lg", iconBgColors[colorVariant])}>
          <Icon className={cn("w-4 h-4", iconTextColors[colorVariant])} />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </span>
      </div>
      
      <p className={cn(
        "font-mono text-2xl font-bold tracking-tight",
        variantColors[colorVariant]
      )}>
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
      
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
