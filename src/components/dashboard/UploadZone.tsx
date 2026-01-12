import { Upload, FileText, Loader2 } from "lucide-react";
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

  // Função auxiliar para converter arquivo em Base64 (exatamente como o backend espera)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Apenas CSV conforme validado no motor de transformação
    if (!file.name.endsWith('.csv')) {
      toast.error("Por favor, selecione um arquivo CSV.");
      return;
    }

    setIsUploading(true);
    setUploadedFile(file.name);

    try {
      const base64Content = await fileToBase64(file);
      
      // Chama a nova função da dialingApi que adicionamos ao api.ts
      const response = await dialingApi.uploadMailing(
        region,
        base64Content,
        file.name
      );

      if (response.status === "sucesso") {
        toast.success(`Mailing ${region} importado com sucesso!`);
        onFileSelect?.(files);
      } else {
        throw new Error(response.mensagem || "Erro no processamento");
      }
    } catch (error: any) {
      console.error("Erro no upload:", error);
      toast.error(`Falha no upload ${region}: ${error.message}`);
      setUploadedFile(null); // Reseta em caso de erro
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
        isUploading && "opacity-70 pointer-events-none"
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
          isMG ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
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
            <p className="text-xs text-muted-foreground mt-1">Processando...</p>
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
