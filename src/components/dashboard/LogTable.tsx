import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  region: "MG" | "SP";
  status: "success" | "error" | "pending";
  records: number;
}

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: "14:32:15", action: "Upload Mailing", region: "MG", status: "success", records: 2450 },
  { id: "2", timestamp: "14:28:42", action: "Discagem Iniciada", region: "SP", status: "success", records: 1890 },
  { id: "3", timestamp: "14:15:08", action: "Processamento", region: "MG", status: "pending", records: 850 },
  { id: "4", timestamp: "13:58:33", action: "Upload Mailing", region: "SP", status: "error", records: 0 },
  { id: "5", timestamp: "13:45:21", action: "Discagem Finalizada", region: "MG", status: "success", records: 3200 },
  { id: "6", timestamp: "13:30:00", action: "Sincronização", region: "SP", status: "success", records: 1500 },
];

export const LogTable = () => {
  const statusStyles = {
    success: "bg-success/10 text-success border-success/30",
    error: "bg-destructive/10 text-destructive border-destructive/30",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  };

  const regionStyles = {
    MG: "bg-success/10 text-success",
    SP: "bg-destructive/10 text-destructive",
  };

  return (
    <div id="log-table-output" className="card-base overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Horário</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Ação</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Região</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Status</TableHead>
            <TableHead className="text-muted-foreground font-semibold text-xs uppercase text-right">Registros</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockLogs.map((log, index) => (
            <TableRow 
              key={log.id} 
              className="border-border/30 hover:bg-muted/30 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-mono text-sm text-muted-foreground">
                {log.timestamp}
              </TableCell>
              <TableCell className="font-medium text-sm">
                {log.action}
              </TableCell>
              <TableCell>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  regionStyles[log.region]
                )}>
                  {log.region}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "px-2 py-0.5 rounded border text-xs font-medium capitalize",
                  statusStyles[log.status]
                )}>
                  {log.status === "success" ? "Sucesso" : log.status === "error" ? "Erro" : "Pendente"}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {log.records.toLocaleString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
