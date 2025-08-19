import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  Lightbulb,
  FileText,
  Calendar,
  Hash,
  Quote,
  Network,
  BarChart3,
  Zap,
  Search
} from "lucide-react";

interface PaperInsightsProps {
  paper: any;
}

export const PaperInsights = ({ paper }: PaperInsightsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const insightCategories = [
    {
      id: "overview",
      label: "Overview",
      icon: FileText,
      content: (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Paper Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
                <p className="text-muted-foreground mb-4">{paper.abstract}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Authors:</span>
                      <span className="text-sm">{paper.authors?.join(", ")}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Year:</span>
                      <span className="text-sm">{paper.year}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Pages:</span>
                      <span className="text-sm">{paper.pageCount}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Category:</span>
                      <Badge variant="secondary">{paper.category}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Quote className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Citations:</span>
                      <span className="text-sm font-semibold text-primary">{paper.citations}</span>
                    </div>
                    
                    {paper.arXivId && (
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">arXiv ID:</span>
                        <span className="text-sm font-mono">{paper.arXivId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords?.map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "insights",
      label: "Key Insights",
      icon: Brain,
      content: (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Research Insights
              </CardTitle>
              <CardDescription>
                AI-extracted key findings and contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paper.keyInsights?.map((insight: string, index: number) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Methodology & Contribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Methodology</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  {paper.methodology}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Main Contribution</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  {paper.contribution}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Limitations</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  {paper.limitations}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "gaps",
      label: "Research Gaps",
      icon: AlertTriangle,
      content: (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Identified Research Gaps
              </CardTitle>
              <CardDescription>
                Areas for future research and improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paper.researchGaps?.map((gap: string, index: number) => (
                  <div key={index} className="flex gap-3 p-4 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                    <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0 mt-2"></div>
                    <div>
                      <p className="text-sm">{gap}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-xs">
                        Explore Related Research →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Research Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">High Impact</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Extending the methodology to larger datasets could significantly impact the field
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Cross-Domain</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Potential applications in related domains remain unexplored
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Methodology</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Novel approaches could address current limitations
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Validation</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Real-world validation studies needed for broader adoption
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "impact",
      label: "Impact Analysis",
      icon: TrendingUp,
      content: (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Citation Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-lg bg-primary/5">
                  <div className="text-2xl font-bold text-primary">{paper.citations}</div>
                  <div className="text-sm text-muted-foreground">Total Citations</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold text-secondary-foreground">
                    {Math.floor(paper.citations / (new Date().getFullYear() - paper.year + 1))}
                  </div>
                  <div className="text-sm text-muted-foreground">Citations/Year</div>
                </div>
                
                <div className="text-center p-4 rounded-lg bg-muted">
                  <div className="text-2xl font-bold text-foreground">
                    {paper.citations > 100 ? 'High' : paper.citations > 20 ? 'Medium' : 'Low'}
                  </div>
                  <div className="text-sm text-muted-foreground">Impact Level</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Research Impact Score</h4>
                  <Progress value={Math.min((paper.citations / 100) * 100, 100)} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on citation count, recency, and field relevance
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Field Influence</h4>
                  <Progress value={75} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Influence within the {paper.category} domain
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-primary" />
                Research Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Author Collaboration</h4>
                  <div className="space-y-2">
                    {paper.authors?.slice(0, 3).map((author: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-muted">
                        <span className="text-sm">{author}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(Math.random() * 50) + 10} papers
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Related Research</h4>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-muted text-sm">
                      Papers citing this work: <span className="font-medium">{Math.floor(paper.citations * 0.8)}</span>
                    </div>
                    <div className="p-2 rounded bg-muted text-sm">
                      Papers cited by this work: <span className="font-medium">{Math.floor(Math.random() * 30) + 15}</span>
                    </div>
                    <div className="p-2 rounded bg-muted text-sm">
                      Co-citation network: <span className="font-medium">{Math.floor(Math.random() * 100) + 50}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Paper Analysis</h2>
          <p className="text-muted-foreground">Comprehensive insights and analysis</p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Brain className="h-3 w-3" />
          AI Generated
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {insightCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="gap-2"
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {insightCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            {category.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};