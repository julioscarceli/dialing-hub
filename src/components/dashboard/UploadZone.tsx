// src/components/dashboard/UploadZone.tsx

import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Função para converter arquivo em Base64 e LIMPAR o prefixo
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove o "data:text/csv;base64," para o Python não quebrar
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Formato inválido. Use apenas .csv");
      return;
    }

    // Logs para acompanhamento no Console (F12)
    console.log(`[LOG-FRONT] Botão ${region} acionado em: ${new Date().toLocaleTimeString()}`);
    console.log(`[LOG-FRONT] Arquivo: ${file.name} | Tamanho: ${file.size} bytes`);
    
    setIsUploading(true);
    setUploadStatus('idle');
    setUploadedFile(file.name);

    try {
      const base64Content = await fileToBase64(file);
      console.log(`[LOG-FRONT] Conversão Base64 concluída. Enviando para Railway...`);
      
      const response = await dialingApi.uploadMailing(
        region,
        base64Content,
        file.name
      );

      console.log(`[LOG-FRONT] Resposta do Servidor:`, response);

      if (response.status === "sucesso") {
        setUploadStatus('success');
        toast.success(`Mailing ${region} importado! ID Lista: ${response.resposta_discador?.id_lista || 'N/A'}`);
        onFileSelect?.(files);
      } else {
        throw new Error(response.mensagem || "Erro inesperado no servidor");
      }
    } catch (error: any) {
      setUploadStatus('error');
      console.error(`[LOG-FRONT] ERRO NO UPLOAD ${region}:`, error);
      toast.error(`Falha no upload ${region}. Veja o console F12 para detalhes.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files);
    }
  }, [region]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files);
    }
  }, [region]);

  const isMG = region === "MG";

  return (
    <div
      className={cn(
        "upload-zone relative group",
        isMG ? "upload-zone-mg" : "upload-zone-sp",
        isDragging && "scale-[1.02] border-secondary bg-secondary/10",
        isUploading && "opacity-70 cursor-wait pointer-events-none"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        accept=".csv"
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={cn(
          "p-3 rounded-full transition-colors",
          isMG ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          uploadStatus === 'success' && "bg-green-500/20 text-green-600",
          uploadStatus === 'error' && "bg-red-500/20 text-red-600"
        )}>
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : uploadStatus === 'success' ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-6 h-6" />
          ) : uploadedFile ? (
            <FileText className="w-6 h-6" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>
        
        <div>
          <h4 className={cn(
            "font-semibold text-sm",
            isMG ? "text-success" : "text-destructive"
          )}>
            Mailing {region}
          </h4>
          {isUploading ? (
            <p className="text-xs text-muted-foreground mt-1 animate-pulse">Enviando e Processando...</p>
          ) : uploadedFile ? (
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
              {uploadedFile}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              Arraste ou clique para upload
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
