// src/components/dashboard/UploadZone.tsx

import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  region: "MG" | "SP";
  onFileChange: (file: File | null) => void;
  externalFile: File | null;
}

export const UploadZone = ({ region, onFileChange, externalFile }: UploadZoneProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const isMG = region === "MG";

  // Sincroniza o visual interno com o estado do Index (essencial para o botão Limpar)
  useEffect(() => {
    setFileName(externalFile ? externalFile.name : null);
  }, [externalFile]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
    console.log(`[UPLOAD-ZONE] 📂 Arquivo selecionado (${region}):`, file?.name);
  };

  return (
    <div className={cn(
      "upload-zone relative p-4 border-2 border-dashed rounded-xl transition-all h-32 flex flex-col items-center justify-center gap-2",
      fileName 
        ? (isMG ? "border-success bg-success/10" : "border-destructive bg-destructive/10") 
        : (isMG ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5")
    )}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFile}
        accept=".csv"
      />
      <div className={cn("p-2 rounded-full", isMG ? "text-success" : "text-destructive")}>
        {fileName ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
      </div>
      <div className="text-center">
        <h4 className="text-xs font-bold uppercase">{region}</h4>
        <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
          {fileName || "Clique para selecionar CSV"}
        </p>
      </div>
    </div>
  );
};
