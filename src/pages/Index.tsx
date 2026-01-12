// src/pages/Index.tsx

import { DollarSign, Activity, Database, Trash2, Upload, Target, Percent, Radio, Users, Loader2 } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { UploadZone } from "@/components/dashboard/UploadZone";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { CostCard } from "@/components/dashboard/CostCard";
import { IdleMonitor } from "@/components/dashboard/IdleMonitor";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { dialingApi } from "@/services/api";
import { useState } from "react";
import { toast } from "sonner";

const Index = () => {
  // Estados para armazenar os arquivos selecionados
  const [fileMG, setFileMG] = useState<File | null>(null);
  const [fileSP, setFileSP] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<string | null>(null);

  const { data: finance } = useQuery({ queryKey: ["financeiro"], queryFn: dialingApi.getFinanceiro, refetchInterval: 30000 });
  const { data: statusMG } = useQuery({ queryKey: ["statusMG"], queryFn: dialingApi.getStatusMG, refetchInterval: 15000 });
  const { data: statusSP } = useQuery({ queryKey: ["statusSP"], queryFn: dialingApi.getStatusSP, refetchInterval: 15000 });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImportClick = async (region: 'MG' | 'SP') => {
    const file = region === 'MG' ? fileMG : fileSP;
    console.log(`[INDEX-LOG] 🖱️ Botão Importar ${region} clicado.`);

    if (!file) {
      console.log(`[INDEX-LOG] ❌ Erro: Nenhum arquivo selecionado para ${region}`);
      toast.error(`Selecione o arquivo CSV de ${region} primeiro!`);
      return;
    }

    setIsImporting(region);
    try {
      console.log(`[INDEX-LOG] 🚀 Iniciando processamento de ${file.name}...`);
      const b64 = await fileToBase64(file);
      const res = await dialingApi.uploadMailing(region, b64, file.name);
      
      console.log(`[INDEX-LOG] ✅ Sucesso!`, res);
      toast.success(`Mailing ${region} enviado com sucesso!`);
    } catch (err: any) {
      console.error(`[INDEX-LOG] ❌ Falha:`, err);
      toast.error(`Erro no upload ${region}: ${err.message}`);
    } finally {
      setIsImporting(null);
    }
  };

  const formatMailingName = (name?: string) => {
    if (!name) return "---";
    return name.replace("MAILING_DISCADOR_", "");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <section>
              <h2 className="section-title flex items-center gap-2">
                <Database className="w-4 h-4" /> Upload de Mailing
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <UploadZone region="MG" onFileChange={setFileMG} />
                <UploadZone region="SP" onFileChange={setFileSP} />
              </div>
            </section>

            <section className="rounded-lg border-2 border-primary/40 bg-card p-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex-1 bg-muted/50 text-xs" onClick={() => window.location.reload()}>
                  <Trash2 className="w-3 h-3 mr-2" /> Limpar
                </Button>
                <Button 
                  className="flex-1 bg-secondary text-secondary-foreground text-xs font-bold" 
                  onClick={() => handleImportClick('MG')}
                  disabled={isImporting === 'MG'}
                >
                  {isImporting === 'MG' ? <Loader2 className="animate-spin mr-2 w-3 h-3" /> : <Upload className="w-3 h-3 mr-2" />}
                  Importar MG
                </Button>
                <Button 
                  className="flex-1 bg-secondary text-secondary-foreground text-xs font-bold" 
                  onClick={() => handleImportClick('SP')}
                  disabled={isImporting === 'SP'}
                >
                  {isImporting === 'SP' ? <Loader2 className="animate-spin mr-2 w-3 h-3" /> : <Upload className="w-3 h-3 mr-2" />}
                  Importar SP
                </Button>
              </div>
            </section>

            <section>
              <h2 className="section-title flex items-center gap-2">
                <Activity className="w-4 h-4" /> Status Operacional
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-2 ml-1">Minas Gerais (MG)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatusCard title="Mailing" value={formatMailingName(statusMG?.nome)} icon={Target} status={statusMG?.nome ? "online" : "neutral"} />
                    <StatusCard title="Progresso" value={statusMG?.progresso || "0%"} icon={Percent} status={statusMG?.nome ? "online" : "neutral"} />
                    <StatusCard title="Canais" value={statusMG?.saidas || "0"} icon={Radio} status={statusMG?.nome ? "online" : "neutral"} subtitle="saídas" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-2 ml-1">São Paulo (SP)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatusCard title="Mailing" value={formatMailingName(statusSP?.nome)} icon={Target} status={statusSP?.nome ? "online" : "neutral"} />
                    <StatusCard title="Progresso" value={statusSP?.progresso || "0%"} icon={Percent} status={statusSP?.nome ? "online" : "neutral"} />
                    <StatusCard title="Canais" value={statusSP?.saidas || "0"} icon={Radio} status={statusSP?.nome ? "online" : "neutral"} subtitle="saídas" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <section>
              <h2 className="section-title flex items-center gap-2"><DollarSign className="w-4 h-4" /> Gestão Financeira</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CostCard title="Saldo Atual" value={finance?.saldo_atual || "---"} icon={DollarSign} highlight colorVariant="primary" />
                <CostCard title="Custo Diário" value={finance?.custo_diario || "---"} icon={DollarSign} colorVariant="alert" />
                <CostCard title="Custo Semanal" value={finance?.custo_semanal || "---"} icon={DollarSign} colorVariant="alert" subtitle="Segunda à Hoje" />
              </div>
            </section>
            <section>
              <h2 className="section-title flex items-center gap-2"><Users className="w-4 h-4" /> Monitoramento de Ociosidade</h2>
              <IdleMonitor />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
