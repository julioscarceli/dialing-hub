import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSoma from "@/assets/logo-soma.jpg";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={logoSoma} 
                alt="SOMA Consignados" 
                className="h-12 w-auto object-contain"
              />
              <div className="border-l border-border pl-4">
                <h1 className="text-lg font-bold text-foreground">
                  Monitor Central
                </h1>
                <p className="text-xs text-muted-foreground">
                  Agendador Discador
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 ml-8">
              <span className="status-indicator status-online" />
              <span className="text-xs text-muted-foreground">Sistema Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-muted">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
