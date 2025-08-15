import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Upload, MessageSquare, BarChart3, Home } from "lucide-react";

type ViewType = 'home' | 'graph' | 'upload' | 'chat' | 'dashboard';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  const navItems: Array<{ id: ViewType; label: string; icon: any }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'graph', label: 'Graph Explorer', icon: Network },
    { id: 'upload', label: 'Upload Papers', icon: Upload },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'dashboard', label: 'Research Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Network className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Arcana Graph
              </h1>
              <p className="text-xs text-muted-foreground">Research Network Explorer</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className="transition-all duration-300 hover:shadow-hover"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
            <Badge variant="secondary" className="ml-4">
              Beta
            </Badge>
          </div>
        </div>
      </div>
    </nav>
  );
};