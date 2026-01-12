import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { dialingApi } from "@/services/api";
import { toast } from "sonner";

interface UploadZoneProps {
  region: "MG" | "SP";
}

export const UploadZone = ({ region }: UploadZoneProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`[DEBUG] 📂 Arquivo selecionado para ${region}: ${file.name}`);
    setIsUploading(true);
    setStatus('idle');
    setFileName(file.name);

    try {
      const b64 = await fileToBase64(file);
      const res = await dialingApi.uploadMailing(region, b64, file.name);
      
      if (res.status === "sucesso") {
        console.log("[DEBUG] ✅ Sucesso no Railway!");
        setStatus('success');
        toast.success(`Mailing ${region} importado com sucesso!`);
      } else {
        throw new Error("Erro no processamento");
      }
    } catch (error: any) {
      console.error("[DEBUG] ❌ Erro no envio:", error);
      setStatus('error');
      toast.error(`Falha no upload ${region}`);
    } finally {
      setIsUploading(false);
    }
  };

  const isMG = region === "MG";

  return (
    <div className={cn(
      "upload-zone relative p-4 border-2 border-dashed rounded-xl transition-all h-32 flex flex-col items-center justify-center gap-2",
      isMG ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5",
      isUploading && "opacity-50 pointer-events-none"
    )}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFile}
        accept=".csv"
      />
      
      <div className={cn("p-2 rounded-full", isMG ? "text-success" : "text-destructive")}>
        {isUploading ? <Loader2 className="animate-spin w-6 h-6" /> : 
         status === 'success' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> :
         status === 'error' ? <AlertCircle className="w-6 h-6 text-red-500" /> :
         fileName ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
      </div>
      
      <div className="text-center">
        <h4 className="text-xs font-bold uppercase">{region}</h4>
        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
          {fileName || "Clique para CSV"}
        </p>
      </div>
    </div>
  );
};
