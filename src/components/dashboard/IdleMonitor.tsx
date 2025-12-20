import { AlertTriangle, Clock, Coffee, Pause, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentIdle {
  id: string;
  name: string;
  idleTime: string;
  status: "idle" | "pause" | "working";
  alertLevel: "normal" | "warning" | "critical";
}

interface IdleStats {
  totalIdlePeriods: number;
  longestIdleTime: string;
  longestIdleAgent: string;
  averageIdleTime: string;
  pausedAgents: number;
  totalAgents: number;
}

// Dados placeholder - serão substituídos pela API
const mockAgents: AgentIdle[] = [
  { id: "1", name: "Operador 01", idleTime: "xx:xx:xx", status: "idle", alertLevel: "normal" },
  { id: "2", name: "Operador 02", idleTime: "xx:xx:xx", status: "idle", alertLevel: "normal" },
  { id: "3", name: "Operador 03", idleTime: "xx:xx:xx", status: "pause", alertLevel: "normal" },
  { id: "4", name: "Operador 04", idleTime: "xx:xx:xx", status: "working", alertLevel: "normal" },
  { id: "5", name: "Operador 05", idleTime: "xx:xx:xx", status: "idle", alertLevel: "normal" },
];

const mockStats: IdleStats = {
  totalIdlePeriods: 0,
  longestIdleTime: "xx:xx:xx",
  longestIdleAgent: "---",
  averageIdleTime: "xx:xx:xx",
  pausedAgents: 0,
  totalAgents: 0,
};

export const IdleMonitor = () => {
  const statusStyles = {
    idle: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    pause: "bg-primary/10 text-primary border-primary/30",
    working: "bg-green-500/10 text-green-600 border-green-500/30",
  };

  const statusLabels = {
    idle: "Ocioso",
    pause: "Pausado",
    working: "Trabalhando",
  };

  const alertStyles = {
    normal: "",
    warning: "bg-yellow-50",
    critical: "bg-red-50",
  };

  return (
    <div className="space-y-4">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-lg border-2 border-primary/40 bg-card p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase">Maior Ociosidade</span>
          </div>
          <p className="font-mono text-base sm:text-xl font-bold text-foreground">{mockStats.longestIdleTime}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">{mockStats.longestIdleAgent}</p>
        </div>

        <div className="rounded-lg border-2 border-primary/40 bg-card p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase">Períodos Ociosos</span>
          </div>
          <p className="font-mono text-base sm:text-xl font-bold text-foreground">{mockStats.totalIdlePeriods || "xxx"}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">no dia</p>
        </div>

        <div className="rounded-lg border-2 border-primary/40 bg-card p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase">Média Ociosidade</span>
          </div>
          <p className="font-mono text-base sm:text-xl font-bold text-foreground">{mockStats.averageIdleTime}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">por operador</p>
        </div>

        <div className="rounded-lg border-2 border-primary/40 bg-card p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <Coffee className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground uppercase">Em Pausa</span>
          </div>
          <p className="font-mono text-base sm:text-xl font-bold text-foreground">{mockStats.pausedAgents || "xxx"}/{mockStats.totalAgents || "xxx"}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-1">agentes</p>
        </div>
      </div>

      {/* Tabela de Agentes */}
      <div className="rounded-lg border-2 border-primary/40 bg-card overflow-hidden">
        <div className="p-2 sm:p-3 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase">Status dos Agentes</span>
          <span className="text-[9px] sm:text-[10px] text-yellow-600 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Alerta: Aumentar agressividade
          </span>
        </div>
        <div className="divide-y divide-border/30">
          {mockAgents.map((agent) => (
            <div 
              key={agent.id} 
              className={cn(
                "flex items-center justify-between p-2 sm:p-3 hover:bg-muted/30 transition-colors",
                alertStyles[agent.alertLevel]
              )}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-muted/50">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground">{agent.name}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                    {agent.alertLevel === "critical" && "⚠️ Ociosidade crítica"}
                    {agent.alertLevel === "warning" && "⚡ Atenção necessária"}
                    {agent.alertLevel === "normal" && "✓ Normal"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right">
                  <p className="font-mono text-xs sm:text-sm font-bold text-foreground">{agent.idleTime}</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">tempo ocioso</p>
                </div>
                <span className={cn(
                  "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border text-[9px] sm:text-[10px] font-medium",
                  statusStyles[agent.status]
                )}>
                  {agent.status === "pause" && <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-0.5 sm:mr-1" />}
                  {statusLabels[agent.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
