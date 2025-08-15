import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target, 
  Calendar,
  Award,
  Network,
  Eye,
  Download
} from "lucide-react";

export const ResearchDashboard = () => {
  const stats = [
    {
      title: "Papers Analyzed",
      value: "1,247",
      change: "+23%",
      icon: BookOpen,
      color: "research-blue"
    },
    {
      title: "Active Connections",
      value: "3,892",
      change: "+15%",
      icon: Network,
      color: "research-purple"
    },
    {
      title: "Research Gaps",
      value: "23",
      change: "+5",
      icon: Target,
      color: "research-orange"
    },
    {
      title: "Collaborators",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "research-green"
    }
  ];

  const trendingTopics = [
    { topic: "Large Language Models", papers: 342, growth: 85 },
    { topic: "Computer Vision", papers: 298, growth: 67 },
    { topic: "Reinforcement Learning", papers: 234, growth: 45 },
    { topic: "Graph Neural Networks", papers: 189, growth: 78 },
    { topic: "Multimodal Learning", papers: 156, growth: 92 }
  ];

  const recentGaps = [
    {
      title: "Attention Visualization in Multimodal Settings",
      confidence: 92,
      papers: 12,
      description: "Limited research on interpreting attention patterns across modalities"
    },
    {
      title: "Efficient Fine-tuning for Domain Adaptation", 
      confidence: 87,
      papers: 8,
      description: "Few-shot domain adaptation with minimal computational overhead"
    },
    {
      title: "Bias Detection in Scientific Literature Analysis",
      confidence: 79,
      papers: 15,
      description: "Systematic approaches to identify and mitigate research bias"
    }
  ];

  const topPapers = [
    {
      title: "Attention Is All You Need",
      authors: "Vaswani et al.",
      year: 2017,
      citations: 45123,
      impact: "Foundational",
      connections: 234
    },
    {
      title: "BERT: Pre-training Deep Bidirectional Transformers",
      authors: "Devlin et al.",
      year: 2018,
      citations: 32456,
      impact: "High",
      connections: 189
    },
    {
      title: "An Image is Worth 16x16 Words",
      authors: "Dosovitskiy et al.",
      year: 2020,
      citations: 12789,
      impact: "Emerging",
      connections: 98
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Research Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Your personalized research intelligence overview
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Eye className="w-4 h-4 mr-2" />
              View Graph
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6 bg-gradient-card hover:shadow-hover transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-research-green">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-research-${stat.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-research-${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Topics */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Trending Research Topics</h3>
              <TrendingUp className="w-5 h-5 text-research-green" />
            </div>
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{topic.topic}</span>
                    <Badge variant="secondary">{topic.papers} papers</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Growth this year</span>
                    <span className="text-research-green">+{topic.growth}%</span>
                  </div>
                  <Progress value={topic.growth} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Research Gaps */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Identified Research Gaps</h3>
              <Target className="w-5 h-5 text-research-orange" />
            </div>
            <div className="space-y-4">
              {recentGaps.map((gap, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{gap.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {gap.confidence}% confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {gap.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {gap.papers} related papers
                    </span>
                    <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                      Explore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Papers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Most Influential Papers in Your Network</h3>
            <Award className="w-5 h-5 text-research-orange" />
          </div>
          <div className="space-y-4">
            {topPapers.map((paper, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{paper.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {paper.authors} • {paper.year}
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{paper.citations.toLocaleString()}</div>
                    <div className="text-muted-foreground">citations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{paper.connections}</div>
                    <div className="text-muted-foreground">connections</div>
                  </div>
                  <Badge 
                    variant={
                      paper.impact === 'Foundational' ? 'default' :
                      paper.impact === 'High' ? 'secondary' : 'outline'
                    }
                  >
                    {paper.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Calendar className="w-5 h-5 text-research-blue" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-muted/20 rounded">
              <div className="w-2 h-2 bg-research-green rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">New paper added:</span>
                <span className="ml-2 text-muted-foreground">
                  "Scaling Laws for Neural Language Models"
                </span>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-muted/20 rounded">
              <div className="w-2 h-2 bg-research-blue rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Research gap identified:</span>
                <span className="ml-2 text-muted-foreground">
                  Attention visualization in multimodal settings
                </span>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-4 p-3 bg-muted/20 rounded">
              <div className="w-2 h-2 bg-research-purple rounded-full"></div>
              <div className="flex-1">
                <span className="font-medium">Connection discovered:</span>
                <span className="ml-2 text-muted-foreground">
                  Link between transformer efficiency and pruning methods
                </span>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};