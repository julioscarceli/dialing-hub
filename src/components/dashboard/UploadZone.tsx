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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const executeUpload = async () => {
    if (!selectedFile) {
      console.log("[DEBUG] Tentativa de upload sem ficheiro.");
      return;
    }

    console.log(`[DEBUG] 🖱️ Clique no botão de confirmação ${region}`);
    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const base64 = await fileToBase64(selectedFile);
      console.log("[DEBUG] Conversão Base64 concluída.");
      
      const response = await dialingApi.uploadMailing(region, base64, selectedFile.name);
      
      if (response.status === "sucesso") {
        setUploadStatus('success');
        toast.success(`Mailing ${region} importado com sucesso!`);
      } else {
        throw new Error(response.mensagem || "Erro no servidor");
      }
    } catch (error: any) {
      setUploadStatus('error');
      console.error("[DEBUG] Erro capturado:", error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`[DEBUG] Ficheiro selecionado: ${file.name}`);
      setSelectedFile(file);
    }
  };

  const isMG = region === "MG";

  return (
    <div className={cn(
      "upload-zone p-6 border-2 border-dashed rounded-xl transition-all relative flex flex-col items-center gap-4",
      isMG ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5",
      isDragging && "scale-105 border-primary bg-primary/5"
    )}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onFileInput}
        accept=".csv"
        disabled={isUploading}
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
      
      <div className="text-center z-10">
        <h4 className={cn("font-semibold text-sm", isMG ? "text-success" : "text-destructive")}>
          Mailing {region}
        </h4>
        <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
          {selectedFile ? selectedFile.name : "Arraste ou clique para selecionar CSV"}
        </p>
      </div>

      {selectedFile && !isUploading && (
        <button
          onClick={(e) => { e.stopPropagation(); executeUpload(); }}
          className={cn(
            "z-20 flex items-center gap-2 px-6 py-2 rounded-lg text-white font-bold animate-bounce shadow-lg",
            isMG ? "bg-success" : "bg-destructive"
          )}
        >
          <Send className="w-4 h-4" />
          CONFIRMAR {region}
        </button>
      )}
    </div>
  );
};
