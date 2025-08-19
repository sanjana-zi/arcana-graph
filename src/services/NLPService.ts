import { pipeline } from "@huggingface/transformers";

export interface TextAnalysis {
  entities: Array<{
    entity: string;
    score: number;
    start: number;
    end: number;
    type: string;
  }>;
  keywords: string[];
  summary: string;
  topics: string[];
  citations: string[];
  methodology: string[];
  findings: string[];
  sentiment: {
    label: string;
    score: number;
  };
}

export class NLPService {
  private static summarizer: any = null;
  private static classifier: any = null;
  private static embeddings: any = null;
  
  static async initialize() {
    try {
      // Initialize models
      this.summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
      this.classifier = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
      this.embeddings = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (error) {
      console.error('Error initializing NLP models:', error);
    }
  }
  
  static async analyzeText(text: string): Promise<TextAnalysis> {
    await this.ensureModelsLoaded();
    
    try {
      const [
        summary,
        sentiment,
        keywords,
        entities,
        topics,
        citations,
        methodology,
        findings
      ] = await Promise.all([
        this.generateSummary(text),
        this.analyzeSentiment(text),
        this.extractKeywords(text),
        this.extractEntities(text),
        this.extractTopics(text),
        this.extractCitations(text),
        this.extractMethodology(text),
        this.extractFindings(text)
      ]);
      
      return {
        summary,
        sentiment,
        keywords,
        entities,
        topics,
        citations,
        methodology,
        findings
      };
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw new Error('Failed to analyze text');
    }
  }
  
  private static async ensureModelsLoaded() {
    if (!this.summarizer || !this.classifier || !this.embeddings) {
      await this.initialize();
    }
  }
  
  private static async generateSummary(text: string): Promise<string> {
    if (!this.summarizer) return "Summary generation unavailable";
    
    try {
      // Truncate text if too long
      const maxLength = 1024;
      const truncatedText = text.length > maxLength ? text.substring(0, maxLength) : text;
      
      const result = await this.summarizer(truncatedText, {
        max_length: 200,
        min_length: 50,
        do_sample: false
      });
      
      return result[0]?.summary_text || "Unable to generate summary";
    } catch (error) {
      console.error('Error generating summary:', error);
      return "Summary generation failed";
    }
  }
  
  private static async analyzeSentiment(text: string): Promise<{ label: string; score: number }> {
    if (!this.classifier) return { label: "NEUTRAL", score: 0.5 };
    
    try {
      const result = await this.classifier(text.substring(0, 512));
      return {
        label: result[0]?.label || "NEUTRAL",
        score: result[0]?.score || 0.5
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return { label: "NEUTRAL", score: 0.5 };
    }
  }
  
  private static extractKeywords(text: string): string[] {
    // Simple keyword extraction using TF-IDF approach
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these',
      'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'can',
      'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must',
      'have', 'has', 'had', 'been', 'being', 'are', 'was', 'were', 'study',
      'research', 'paper', 'analysis', 'method', 'approach', 'results'
    ]);
    
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }
  
  private static extractEntities(text: string): Array<{
    entity: string;
    score: number;
    start: number;
    end: number;
    type: string;
  }> {
    // Simple entity extraction using regex patterns
    const entities: Array<{
      entity: string;
      score: number;
      start: number;
      end: number;
      type: string;
    }> = [];
    
    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    let match;
    while ((match = emailRegex.exec(text)) !== null) {
      entities.push({
        entity: match[0],
        score: 0.9,
        start: match.index,
        end: match.index + match[0].length,
        type: 'EMAIL'
      });
    }
    
    // URL pattern
    const urlRegex = /https?:\/\/[^\s]+/g;
    while ((match = urlRegex.exec(text)) !== null) {
      entities.push({
        entity: match[0],
        score: 0.9,
        start: match.index,
        end: match.index + match[0].length,
        type: 'URL'
      });
    }
    
    // Capitalized words (potential proper nouns)
    const nameRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
    while ((match = nameRegex.exec(text)) !== null) {
      if (match[0].length > 2) {
        entities.push({
          entity: match[0],
          score: 0.7,
          start: match.index,
          end: match.index + match[0].length,
          type: 'PERSON_OR_ORG'
        });
      }
    }
    
    return entities;
  }
  
  private static extractTopics(text: string): string[] {
    // Extract potential research topics using common academic keywords
    const topicKeywords = [
      'machine learning', 'deep learning', 'artificial intelligence', 'neural network',
      'natural language processing', 'computer vision', 'data mining', 'big data',
      'blockchain', 'cryptocurrency', 'quantum computing', 'climate change',
      'renewable energy', 'biotechnology', 'genetics', 'crispr', 'immunology',
      'psychology', 'neuroscience', 'cognitive science', 'social network',
      'algorithm', 'optimization', 'statistics', 'probability', 'regression',
      'classification', 'clustering', 'reinforcement learning', 'transformer',
      'attention mechanism', 'computer graphics', 'human-computer interaction'
    ];
    
    const lowerText = text.toLowerCase();
    const foundTopics = topicKeywords.filter(topic => 
      lowerText.includes(topic.toLowerCase())
    );
    
    return foundTopics.slice(0, 5);
  }
  
  private static extractCitations(text: string): string[] {
    const citations: string[] = [];
    
    // Common citation patterns
    const patterns = [
      /\([A-Za-z]+(?:\s+et\s+al\.?)?,?\s+\d{4}\)/g,  // (Author, 2020)
      /\[[A-Za-z]+(?:\s+et\s+al\.?)?,?\s+\d{4}\]/g,  // [Author, 2020]
      /\[\d+\]/g,  // [1]
      /\(\d+\)/g   // (1)
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        citations.push(...matches);
      }
    });
    
    return [...new Set(citations)].slice(0, 10);
  }
  
  private static extractMethodology(text: string): string[] {
    const methodKeywords = [
      'methodology', 'method', 'approach', 'technique', 'procedure',
      'experimental design', 'data collection', 'statistical analysis',
      'survey', 'interview', 'observation', 'case study', 'experiment',
      'simulation', 'modeling', 'evaluation', 'validation', 'testing'
    ];
    
    const lowerText = text.toLowerCase();
    const sentences = text.split(/[.!?]+/);
    
    const methodSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return methodKeywords.some(keyword => lowerSentence.includes(keyword));
    });
    
    return methodSentences.slice(0, 3).map(s => s.trim());
  }
  
  private static extractFindings(text: string): string[] {
    const findingKeywords = [
      'findings', 'results', 'conclusion', 'discovered', 'found that',
      'demonstrated', 'showed', 'revealed', 'indicates', 'suggests',
      'evidence', 'significant', 'correlation', 'improvement', 'performance'
    ];
    
    const sentences = text.split(/[.!?]+/);
    
    const findingSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return findingKeywords.some(keyword => lowerSentence.includes(keyword));
    });
    
    return findingSentences.slice(0, 3).map(s => s.trim());
  }
  
  static async generateEmbeddings(text: string): Promise<number[]> {
    await this.ensureModelsLoaded();
    
    if (!this.embeddings) return [];
    
    try {
      const result = await this.embeddings(text.substring(0, 512));
      return Array.from(result.data);
    } catch (error) {
      console.error('Error generating embeddings:', error);
      return [];
    }
  }
}