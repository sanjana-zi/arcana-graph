import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { GraphExplorer } from "@/components/GraphExplorer";
import { UploadInterface } from "@/components/UploadInterface";
import { ChatInterface } from "@/components/ChatInterface";
import { ResearchDashboard } from "@/components/ResearchDashboard";

type ViewType = 'home' | 'graph' | 'upload' | 'chat' | 'dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderView = () => {
    switch (currentView) {
      case 'graph':
        return <GraphExplorer />;
      case 'upload':
        return <UploadInterface />;
      case 'chat':
        return <ChatInterface />;
      case 'dashboard':
        return <ResearchDashboard />;
      default:
        return <HeroSection onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main className="relative">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;