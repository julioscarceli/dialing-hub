import { Upload, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  region: "MG" | "SP";
  onFileSelect?: (files: FileList) => void;
}

export const UploadZone = ({ region, onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

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
      setUploadedFile(e.dataTransfer.files[0].name);
      onFileSelect?.(e.dataTransfer.files);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0].name);
      onFileSelect?.(e.target.files);
    }
  }, [onFileSelect]);

  const isMG = region === "MG";

  return (
    <div
      className={cn(
        "upload-zone relative group",
        isMG ? "upload-zone-mg" : "upload-zone-sp",
        isDragging && "scale-[1.02] border-secondary bg-secondary/10"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileInput}
        accept=".csv,.xlsx,.xls"
      />
      
      <div className="flex flex-col items-center gap-3 text-center">
        <div className={cn(
          "p-3 rounded-full transition-colors",
          isMG ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {uploadedFile ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
        </div>
        
        <div>
          <h4 className={cn(
            "font-semibold text-sm",
            isMG ? "text-success" : "text-destructive"
          )}>
            Mailing {region}
          </h4>
          {uploadedFile ? (
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
