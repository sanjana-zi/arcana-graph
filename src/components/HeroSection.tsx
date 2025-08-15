import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Brain, Network, Search, Zap } from "lucide-react";

type ViewType = 'home' | 'graph' | 'upload' | 'chat' | 'dashboard';

interface HeroSectionProps {
  onNavigate: (view: ViewType) => void;
}

export const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const features = [
    {
      icon: Network,
      title: "Interactive Knowledge Graphs",
      description: "Visualize research connections and discover hidden patterns in scientific literature.",
      color: "research-blue"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced language models extract insights and identify research gaps automatically.",
      color: "research-purple"
    },
    {
      icon: Search,
      title: "Semantic Search",
      description: "Find papers by concepts and meaning, not just keywords. Ask natural language questions.",
      color: "research-cyan"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay current with the latest research from arXiv and major academic databases.",
      color: "research-orange"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      <div className="absolute inset-0 bg-gradient-graph" />
      
      <div className="relative container mx-auto px-6 py-24">
        {/* Main Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center bg-gradient-primary rounded-full px-6 py-2 mb-8">
            <span className="text-sm font-medium text-primary-foreground">
              🚀 Revolutionizing Research Discovery
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Navigate the
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              Research Universe
            </span>
            with Intelligence
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
            Transform how you explore scientific literature. Build dynamic knowledge graphs, 
            discover hidden connections, and uncover research opportunities with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => onNavigate('graph')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              Explore Research Graph
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('upload')}
              className="text-lg px-8 py-6 border-2 hover:shadow-hover transition-all duration-300"
            >
              Upload Your Papers
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-gradient-card hover:shadow-hover transition-all duration-300 border-0 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-research-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-research-${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-card border-0 shadow-card max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Research?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join researchers worldwide who are discovering connections and insights 
              they never knew existed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onNavigate('chat')}
                className="bg-secondary hover:bg-secondary/90 transition-colors duration-300"
              >
                Try AI Assistant
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};