// src/components/dashboard/UploadZone.tsx
import { Upload, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  region: "MG" | "SP";
  onFileChange: (file: File | null) => void;
}

export const UploadZone = ({ region, onFileChange }: UploadZoneProps) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const isMG = region === "MG";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileChange(file);
    console.log(`[UPLOAD-ZONE] Arquivo selecionado para ${region}:`, file?.name);
  };

  return (
    <div className={cn(
      "upload-zone relative p-4 border-2 border-dashed rounded-xl transition-all h-32 flex flex-col items-center justify-center gap-2",
      isMG ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
    )}>
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFile}
        accept=".csv"
      />
      <div className={cn("p-2 rounded-full", isMG ? "text-success" : "text-destructive")}>
        {fileName ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
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
