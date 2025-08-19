import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Brain, Search, TrendingUp, Users, BookOpen, ArrowRight } from "lucide-react";
import { UploadInterface } from "@/components/UploadInterface";
import { PaperInsights } from "@/components/PaperInsights";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedPapers, setUploadedPapers] = useState<any[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);
  const { toast } = useToast();

  const handlePaperUpload = (paperData: any) => {
    setUploadedPapers(prev => [...prev, paperData]);
    toast({
      title: "Paper Uploaded Successfully",
      description: `"${paperData.title}" has been analyzed and added to your library.`,
    });
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Extract key insights, methodologies, and findings automatically"
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find relevant papers and connections across your research library"
    },
    {
      icon: TrendingUp,
      title: "Research Trends",
      description: "Identify emerging patterns and gaps in the literature"
    },
    {
      icon: Users,
      title: "Collaboration Network",
      description: "Map author networks and research collaborations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Research Paper
              <span className="text-primary"> Graph Explorer</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform how you navigate scientific literature with AI-powered insights, 
              interactive knowledge graphs, and intelligent paper analysis.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Upload className="h-5 w-5" />
                Upload Papers
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Explore Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Intelligent Research Analysis</h2>
          <p className="text-muted-foreground">Discover the power of AI-driven research exploration</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-border/50 hover:border-primary/20 transition-colors">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Upload & Analyze Papers
            </h3>
            <UploadInterface onPaperUploaded={handlePaperUpload} />
          </div>

          {/* Paper Library */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Your Research Library
              {uploadedPapers.length > 0 && (
                <span className="bg-primary text-primary-foreground text-sm px-2 py-1 rounded-full">
                  {uploadedPapers.length}
                </span>
              )}
            </h3>
            
            {uploadedPapers.length === 0 ? (
              <Card className="border-dashed border-2 border-muted">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload your first research paper to see detailed insights and analysis
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {uploadedPapers.map((paper, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer border transition-all hover:border-primary/20 ${
                      selectedPaper?.id === paper.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                            {paper.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {paper.authors?.join(", ")} • {paper.year}
                          </p>
                          <div className="flex gap-2">
                            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                              {paper.category}
                            </span>
                            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                              {paper.pageCount} pages
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Paper Insights */}
        {selectedPaper && (
          <div className="mt-12">
            <PaperInsights paper={selectedPaper} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;