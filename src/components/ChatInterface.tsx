import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Lightbulb, BookOpen, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'suggestion' | 'paper' | 'insight';
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI research assistant. I can help you discover papers, identify research gaps, and explore connections in the literature. What would you like to explore today?",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    "Find papers about transformer attention mechanisms",
    "What are the current research gaps in computer vision?",
    "Show me papers related to reinforcement learning",
    "Identify emerging trends in NLP",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        {
          content: `I found several relevant papers about "${userMessage}". Based on my analysis of your research graph, here are the most impactful ones connected to your current work:

**Key Papers:**
• "Attention Is All You Need" (Vaswani et al., 2017) - 45,123 citations
• "BERT: Pre-training of Deep Bidirectional Transformers" (Devlin et al., 2018) - 32,456 citations
• "An Image is Worth 16x16 Words" (Dosovitskiy et al., 2020) - 12,789 citations

**Research Gaps Identified:**
• Limited work on attention visualization in multimodal settings
• Sparse research on computational efficiency of attention mechanisms
• Underexplored area: attention in few-shot learning scenarios

Would you like me to explore any of these areas deeper or find papers on a specific aspect?`,
          type: 'insight' as const
        },
        {
          content: `Based on the papers in your research graph, I've identified some interesting patterns:

**Emerging Trends:**
• Multimodal learning is gaining momentum (40% increase in citations)
• Self-supervised methods are becoming dominant in computer vision
• Efficiency research is hot - smaller models with comparable performance

**Research Opportunities:**
• Cross-lingual transfer learning is underexplored
• Real-world deployment challenges need more attention
• Bias and fairness in large language models

**Connected Papers You Might Have Missed:**
• "Scaling Laws for Neural Language Models" - highly cited, connects to your efficiency research
• "Model-Agnostic Meta-Learning" - bridges to your few-shot learning interests

Shall I create a visualization of these connections for you?`,
          type: 'suggestion' as const
        }
      ];

      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: response.type
      }]);
      
      setIsTyping(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    simulateAIResponse(input);
    setInput("");
  };

  const handleSuggestedQuery = (query: string) => {
    setInput(query);
  };

  const getMessageIcon = (message: Message) => {
    if (message.sender === 'user') return <User className="w-4 h-4" />;
    
    switch (message.type) {
      case 'insight':
        return <Lightbulb className="w-4 h-4 text-research-orange" />;
      case 'paper':
        return <BookOpen className="w-4 h-4 text-research-blue" />;
      case 'suggestion':
        return <TrendingUp className="w-4 h-4 text-research-purple" />;
      default:
        return <Bot className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="h-screen bg-gradient-graph flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">AI Research Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Explore papers, discover connections, and identify research opportunities
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Try asking about:</h3>
            <div className="space-y-2">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuery(query)}
                  className="w-full text-left justify-start h-auto p-3 text-xs"
                >
                  {query}
                </Button>
              ))}
            </div>
          </div>

          <Card className="p-4">
            <h3 className="font-medium mb-3">Research Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Papers analyzed:</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connections found:</span>
                <span className="font-medium">3,892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Research gaps:</span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {getMessageIcon(message)}
                  </div>
                )}
                
                <Card
                  className={`max-w-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-card'
                  }`}
                >
                  {message.type && message.sender === 'assistant' && (
                    <div className="mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {message.type === 'insight' && 'Research Insight'}
                        {message.type === 'paper' && 'Paper Recommendation'}
                        {message.type === 'suggestion' && 'Trend Analysis'}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </Card>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <Card className="p-4 bg-card">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about papers, research gaps, trends, or connections..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isTyping}
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};