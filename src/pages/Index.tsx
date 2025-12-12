import { 
  Phone, 
  PhoneOff, 
  Users, 
  Clock, 
  TrendingUp, 
  DollarSign,
  Activity,
  BarChart3,
  Zap,
  Database
} from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { CostCard } from "@/components/dashboard/CostCard";
import { LogTable } from "@/components/dashboard/LogTable";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Coluna 1: Controles e Status */}
          <div className="lg:col-span-5 space-y-6">
            {/* Áreas de Upload */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Database className="w-4 h-4" />
                Upload de Mailing
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <UploadZone region="MG" />
                <UploadZone region="SP" />
              </div>
            </section>

            {/* Painel Status Atual */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Status Atual
              </h2>
              <div id="realtime-status" className="grid grid-cols-2 gap-4">
                <StatusCard 
                  title="Linhas Ativas MG"
                  value="24"
                  icon={Phone}
                  status="online"
                  subtitle="de 30 disponíveis"
                />
                <StatusCard 
                  title="Linhas Ativas SP"
                  value="18"
                  icon={Phone}
                  status="online"
                  subtitle="de 25 disponíveis"
                />
                <StatusCard 
                  title="Em Espera"
                  value="156"
                  icon={Clock}
                  status="warning"
                  subtitle="aguardando"
                />
                <StatusCard 
                  title="Desconectadas"
                  value="3"
                  icon={PhoneOff}
                  status="offline"
                  subtitle="requer atenção"
                />
                <StatusCard 
                  title="Taxa de Atendimento"
                  value="67%"
                  icon={TrendingUp}
                  status="online"
                />
                <StatusCard 
                  title="Operadores Online"
                  value="12"
                  icon={Users}
                  status="online"
                />
                <StatusCard 
                  title="Chamadas/Hora"
                  value="342"
                  icon={Zap}
                  status="neutral"
                />
                <StatusCard 
                  title="Tempo Médio"
                  value="2:45"
                  icon={Clock}
                  status="neutral"
                  subtitle="min/chamada"
                />
              </div>
            </section>

            {/* Ações Rápidas */}
            <section className="card-base p-4">
              <div className="flex flex-wrap gap-3">
                <Button className="flex-1 min-w-[120px]">
                  <Phone className="w-4 h-4 mr-2" />
                  Iniciar Discagem
                </Button>
                <Button variant="outline" className="flex-1 min-w-[120px]">
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Pausar Sistema
                </Button>
              </div>
            </section>
          </div>

          {/* Coluna 2: Custo e Histórico */}
          <div className="lg:col-span-7 space-y-6">
            {/* Painel Custo Discador */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Custo Discador
              </h2>
              <div id="custo-discador-output" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CostCard 
                  title="Saldo Atual"
                  value="R$ 4.280"
                  icon={DollarSign}
                  highlight
                />
                <CostCard 
                  title="Gasto Hoje"
                  value="R$ 892"
                  icon={TrendingUp}
                  trend="up"
                  trendValue="+12%"
                />
                <CostCard 
                  title="Custo/Chamada"
                  value="R$ 0.18"
                  icon={Phone}
                  trend="down"
                  trendValue="-3%"
                />
                <CostCard 
                  title="Projeção Mensal"
                  value="R$ 24.5k"
                  icon={BarChart3}
                  trend="neutral"
                />
              </div>
            </section>

            {/* Métricas Adicionais */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Métricas de Desempenho
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="card-base p-4 text-center">
                  <p className="text-3xl font-bold text-primary font-mono">4.892</p>
                  <p className="text-xs text-muted-foreground mt-1">Chamadas Hoje</p>
                </div>
                <div className="card-base p-4 text-center">
                  <p className="text-3xl font-bold text-secondary font-mono">1.247</p>
                  <p className="text-xs text-muted-foreground mt-1">Atendidas</p>
                </div>
                <div className="card-base p-4 text-center">
                  <p className="text-3xl font-bold text-success font-mono">423</p>
                  <p className="text-xs text-muted-foreground mt-1">Conversões</p>
                </div>
              </div>
            </section>

            {/* Histórico / Log */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Histórico de Ações
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
