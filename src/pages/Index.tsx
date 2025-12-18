import { DollarSign, Activity, Clock, Database, Trash2, Upload, Target, Percent, Radio } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { CostCard } from "@/components/dashboard/CostCard";
import { LogTable } from "@/components/dashboard/LogTable";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { dialingApi } from "@/services/api";

const Index = () => {
  // Query para dados financeiros
  const { data: finance } = useQuery({
    queryKey: ["financeiro"],
    queryFn: dialingApi.getFinanceiro,
    refetchInterval: 30000, // Atualiza a cada 30s
  });

  // Query para Status MG
  const { data: statusMG } = useQuery({
    queryKey: ["statusMG"],
    queryFn: dialingApi.getStatusMG,
    refetchInterval: 15000, // MG atualiza a cada 15s
  });

  // Query para Status SP
  const { data: statusSP } = useQuery({
    queryKey: ["statusSP"],
    queryFn: dialingApi.getStatusSP,
    refetchInterval: 15000, // SP atualiza a cada 15s
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coluna 1: Controles e Status */}
          <div className="lg:col-span-5 space-y-6">
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Database className="w-4 h-4" /> Upload de Mailing
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <UploadZone region="MG" />
                <UploadZone region="SP" />
              </div>
            </section>

            <section className="card-base p-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex-1 min-w-[100px] bg-muted/50 hover:bg-muted">
                  <Trash2 className="w-4 h-4 mr-2" /> Limpar Uploads
                </Button>
                <Button className="flex-1 min-w-[100px] bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Upload className="w-4 h-4 mr-2" /> Importar MG
                </Button>
                <Button className="flex-1 min-w-[100px] bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Upload className="w-4 h-4 mr-2" /> Importar SP
                </Button>
              </div>
            </section>

            {/* Painel Status Atual Dinâmico */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Activity className="w-4 h-4" /> Status Atual
              </h2>
              <div className="space-y-4">
                {/* Minas Gerais */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary border-l-2 border-secondary pl-2">Minas Gerais (MG)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StatusCard title="Mailing" value={statusMG?.nome || "Carregando..."} icon={Target} status={statusMG ? "online" : "neutral"} />
                    <StatusCard title="Progresso" value={statusMG?.progresso || "0%"} icon={Percent} status={statusMG ? "online" : "neutral"} />
                    <StatusCard title="Canais" value={statusMG?.saidas || "0"} icon={Radio} status={statusMG ? "online" : "neutral"} subtitle="saídas" />
                  </div>
                </div>
                {/* São Paulo */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary border-l-2 border-secondary pl-2">São Paulo (SP)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StatusCard title="Mailing" value={statusSP?.nome || "Carregando..."} icon={Target} status={statusSP ? "online" : "neutral"} />
                    <StatusCard title="Progresso" value={statusSP?.progresso || "0%"} icon={Percent} status={statusSP ? "online" : "neutral"} />
                    <StatusCard title="Canais" value={statusSP?.saidas || "0"} icon={Radio} status={statusSP ? "online" : "neutral"} subtitle="saídas" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Coluna 2: Custo Financeiro Dinâmico */}
          <div className="lg:col-span-7 space-y-6">
            <section>
              <h2 className="section-title flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Custo Discador - Financeiro
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <CostCard title="Saldo Atual" value={finance?.saldo_atual || "---"} icon={DollarSign} highlight colorVariant="primary" />
                <CostCard title="Custo Diário" value={finance?.custo_diario || "---"} icon={DollarSign} colorVariant="alert" />
                <CostCard title="Custo Semanal" value={finance?.custo_semanal || "---"} icon={DollarSign} colorVariant="alert" subtitle="Seg à Hoje" />
              </div>
            </section>

            <section>
              <h2 className="section-title flex items-center gap-2">
                <Clock className="w-4 h-4" /> Histórico de Ações
              </h2>
              <LogTable />
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;
