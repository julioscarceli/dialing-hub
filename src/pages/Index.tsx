import { 
  DollarSign,
  Activity,
  Clock,
  Database,
  Trash2,
  Upload,
  Target,
  Percent,
  Radio
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

            {/* Botões de Ação */}
            <section className="card-base p-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex-1 min-w-[100px] bg-muted/50 hover:bg-muted">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Uploads
                </Button>
                <Button className="flex-1 min-w-[100px] bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar MG
                </Button>
                <Button className="flex-1 min-w-[100px] bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Upload className="w-4 h-4 mr-2" />
                  Importar SP
                </Button>
              </div>
            </section>

            {/* Painel Status Atual */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Status Atual
              </h2>
              <div id="realtime-status" className="space-y-4">
                {/* Status MG */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary border-l-2 border-secondary pl-2">
                    Minas Gerais (MG)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StatusCard 
                      title="Mailing Ativo"
                      value="Campanha A"
                      icon={Target}
                      status="online"
                    />
                    <StatusCard 
                      title="Progresso"
                      value="67%"
                      icon={Percent}
                      status="online"
                    />
                    <StatusCard 
                      title="Canais"
                      value="24"
                      icon={Radio}
                      status="online"
                      subtitle="saídas"
                    />
                  </div>
                </div>
                
                {/* Status SP */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary border-l-2 border-secondary pl-2">
                    São Paulo (SP)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <StatusCard 
                      title="Mailing Ativo"
                      value="Campanha B"
                      icon={Target}
                      status="offline"
                    />
                    <StatusCard 
                      title="Progresso"
                      value="42%"
                      icon={Percent}
                      status="offline"
                    />
                    <StatusCard 
                      title="Canais"
                      value="18"
                      icon={Radio}
                      status="offline"
                      subtitle="saídas"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Coluna 2: Custo e Histórico */}
          <div className="lg:col-span-7 space-y-6">
            {/* Painel Custo Discador */}
            <section>
              <h2 className="section-title flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Custo Discador - Financeiro
              </h2>
              <div id="custo-discador-output" className="grid grid-cols-3 gap-4">
                <CostCard 
                  title="Saldo Atual"
                  value="R$ 4.280"
                  icon={DollarSign}
                  highlight
                  colorVariant="primary"
                />
                <CostCard 
                  title="Custo Diário"
                  value="R$ 892"
                  icon={DollarSign}
                  colorVariant="alert"
                />
                <CostCard 
                  title="Custo Semanal"
                  value="R$ 3.120"
                  icon={DollarSign}
                  colorVariant="alert"
                  subtitle="Seg à Hoje"
                />
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
