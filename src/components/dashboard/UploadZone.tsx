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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error("Por favor, selecione um arquivo primeiro.");
      return;
    }

    console.log(`[DEBUG] 🖱️ Clique detectado em Importar ${region}`);
    setIsUploading(true);
    setUploadStatus('idle');

    try {
      const base64 = await fileToBase64(uploadedFile);
      const response = await dialingApi.uploadMailing(region, base64, uploadedFile.name);

      if (response.status === "sucesso") {
        setUploadStatus('success');
        toast.success(`Mailing ${region} importado com sucesso!`);
        console.log(`[DEBUG] ✅ Sucesso:`, response);
      } else {
        throw new Error(response.mensagem || "Erro no servidor");
      }
    } catch (error: any) {
      setUploadStatus('error');
      console.error(`[DEBUG] ❌ Erro:`, error);
      toast.error(`Falha: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`[DEBUG] 📂 Arquivo selecionado: ${file.name}`);
      setUploadedFile(file);
      setUploadStatus('idle');
      if (onFileSelect && e.target.files) onFileSelect(e.target.files);
    }
  };

  const isMG = region === "MG";

  return (
    <div 
      className={cn(
        "upload-zone relative group",
        isMG ? "upload-zone-mg" : "upload-zone-sp",
        isDragging && "scale-[1.02] border-secondary bg-secondary/10",
        isUploading && "opacity-70 pointer-events-none"
      )}
      onClick={handleUpload} // O clique na zona dispara o upload se já houver arquivo
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files[0]) setUploadedFile(e.dataTransfer.files[0]);
      }}
    >
      {/* Input invisível para seleção de arquivo se não houver um selecionado */}
      {!uploadedFile && (
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileInput}
          accept=".csv"
        />
      )}
      
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={cn(
          "p-3 rounded-full transition-colors",
          isMG ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive",
          uploadStatus === 'success' && "bg-green-500/20 text-green-600"
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
          <h4 className={cn("font-semibold text-sm", isMG ? "text-success" : "text-destructive")}>
            Importar {region}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]">
            {uploadedFile ? uploadedFile.name : "Clique para selecionar CSV"}
          </p>
        </div>
      </div>

      {/* Botão de reset pequeno caso queira trocar o arquivo */}
      {uploadedFile && !isUploading && (
        <button 
          onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadStatus('idle'); }}
          className="absolute top-2 right-2 text-[10px] underline text-gray-400 hover:text-gray-600"
        >
          Trocar
        </button>
      )}
    </div>
  );
};
