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
  const [fileMG, setFileMG] = useState<File | null>(null);
  const [fileSP, setFileSP] = useState<File | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

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

  const handleImport = async (region: 'MG' | 'SP') => {
    const file = region === 'MG' ? fileMG : fileSP;
    console.log(`[INDEX-LOG] 🖱️ Botão Importar ${region} clicado.`);

    if (!file) {
      toast.error(`Selecione o arquivo CSV de ${region} primeiro!`);
      return;
    }

    setLoading(region);
    try {
      console.log(`[INDEX-LOG] Convertendo arquivo ${file.name}...`);
      const b64 = await fileToBase64(file);
      const res = await dialingApi.uploadMailing(region, b64, file.name);
      
      console.log(`[INDEX-LOG] Sucesso Railway:`, res);
      toast.success(`Mailing ${region} importado com sucesso!`);
    } catch (err: any) {
      console.error(`[INDEX-LOG] Erro:`, err);
      toast.error(`Erro no upload ${region}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8">
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
                <Button variant="outline" className="flex-1 min-w-[120px] bg-muted/50 text-xs" onClick={() => { setFileMG(null); setFileSP(null); }}>
                  <Trash2 className="w-3 h-3 mr-2" /> Limpar
                </Button>
                <Button 
                  className="flex-1 min-w-[120px] bg-secondary text-xs font-bold" 
                  onClick={() => handleImport('MG')}
                  disabled={loading === 'MG'}
                >
                  {loading === 'MG' ? <Loader2 className="animate-spin mr-2" /> : <Upload className="w-3 h-3 mr-2" />}
                  Importar MG
                </Button>
                <Button 
                  className="flex-1 min-w-[120px] bg-secondary text-xs font-bold" 
                  onClick={() => handleImport('SP')}
                  disabled={loading === 'SP'}
                >
                  {loading === 'SP' ? <Loader2 className="animate-spin mr-2" /> : <Upload className="w-3 h-3 mr-2" />}
                  Importar SP
                </Button>
              </div>
            </section>
            {/* Resto do seu código de Status Cards igual ao original... */}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Index;
