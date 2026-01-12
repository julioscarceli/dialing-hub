// src/components/dashboard/UploadZone.tsx

import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { dialingApi } from "@/services/api";
import { toast } from "sonner";

interface UploadZoneProps {
  region: "MG" | "SP";
  onFileSelect?: (files: FileList) => void;
}

export const UploadZone = ({ region, onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Converte arquivo para Base64 (limpando o prefixo data:)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const executeUpload = async (e: React.MouseEvent) => {
    // 🚨 IMPORTANTE: Impede que o clique "caia" no input de arquivo novamente
    e.preventDefault();
    e.stopPropagation();

    if (!selectedFile) return;

    console.log(`[DEBUG-CLICK] 🖱️ Botão CONFIRMAR ${region} acionado!`);
    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const base64 = await fileToBase64(selectedFile);
      console.log("[DEBUG-PROCESS] 📝 Base64 pronto. Chamando API...");
      
      const response = await dialingApi.uploadMailing(region, base64, selectedFile.name);
      
      if (response.status === "sucesso") {
        setUploadStatus('success');
        console.log("[DEBUG-SUCCESS] ✅ Upload concluído com sucesso.");
        toast.success(`Mailing ${region} importado com sucesso!`);
      } else {
        throw new Error(response.mensagem || "Erro retornado pelo servidor");
      }
    } catch (error: any) {
      setUploadStatus('error');
      console.error("[DEBUG-ERROR] ❌ Falha no processo:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`[DEBUG-FILE] 📂 Arquivo detectado: ${file.name}`);
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const isMG = region === "MG";

  return (
    <div
      className={cn(
        "upload-zone p-6 border-2 border-dashed rounded-xl transition-all relative flex flex-col items-center gap-4",
        isMG ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5",
        isDragging && "scale-105 border-primary bg-primary/5",
        isUploading && "opacity-70 cursor-wait"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) setSelectedFile(file);
      }}
    >
      {/* Input de arquivo - Só fica ativo se não houver arquivo selecionado ou se não estiver subindo */}
      <input
        type="file"
        className={cn(
          "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
          (selectedFile || isUploading) && "hidden"
        )}
        onChange={handleFileInput}
        accept=".csv"
      />
      
      <div className={cn(
        "p-3 rounded-full transition-colors",
        isMG ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
        uploadStatus === 'success' && "bg-green-500/20 text-green-600",
        uploadStatus === 'error' && "bg-red-500/20 text-red-600"
      )}>
        {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : 
         uploadStatus === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
         uploadStatus === 'error' ? <AlertCircle className="w-6 h-6" /> :
         selectedFile ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
      </div>
      
      <div className="text-center">
        <h4 className={cn("font-semibold text-sm", isMG ? "text-success" : "text-destructive")}>
          Mailing {region}
        </h4>
        <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
          {selectedFile ? selectedFile.name : "Clique ou arraste o CSV"}
        </p>
      </div>

      {/* Botão de Confirmação - Aparece apenas após selecionar o arquivo */}
      {selectedFile && !isUploading && (
        <button
          onClick={executeUpload}
          className={cn(
            "relative z-30 flex items-center gap-2 px-6 py-2 rounded-lg text-white font-bold shadow-lg transition-transform hover:scale-105 active:scale-95",
            isMG ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"
          )}
        >
          <Send className="w-4 h-4" />
          CONFIRMAR {region}
        </button>
      )}

      {selectedFile && !isUploading && (
        <button 
          onClick={() => setSelectedFile(null)}
          className="text-[10px] text-muted-foreground underline hover:text-primary z-30"
        >
          Trocar arquivo
        </button>
      )}
    </div>
  );
};
