export interface GraphNode {
  id: string;
  type: 'paper' | 'author' | 'topic' | 'citation' | 'keyword';
  label: string;
  data: any;
  position?: { x: number; y: number };
  size?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'cites' | 'authored_by' | 'contains_topic' | 'similar_to' | 'collaborates_with';
  weight?: number;
  label?: string;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    totalPapers: number;
    totalAuthors: number;
    totalTopics: number;
  };
}

export class GraphService {
  private static graph: KnowledgeGraph = {
    nodes: [],
    edges: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      totalPapers: 0,
      totalAuthors: 0,
      totalTopics: 0
    }
  };
  
  static getGraph(): KnowledgeGraph {
    return this.graph;
  }
  
  static addPaper(paperData: any, analysisData: any): GraphNode {
    const paperId = `paper_${paperData.id}`;
    
    // Create paper node
    const paperNode: GraphNode = {
      id: paperId,
      type: 'paper',
      label: paperData.title,
      data: {
        ...paperData,
        analysis: analysisData
      },
      size: Math.max(10, Math.min(50, (paperData.citations || 0) / 10 + 10)),
      color: this.getCategoryColor(paperData.category)
    };
    
    // Remove existing paper if it exists
    this.graph.nodes = this.graph.nodes.filter(node => node.id !== paperId);
    this.graph.nodes.push(paperNode);
    
    // Add author nodes and edges
    if (paperData.authors) {
      paperData.authors.forEach((author: string, index: number) => {
        const authorId = `author_${author.replace(/\s+/g, '_')}`;
        
        // Add or update author node
        let authorNode = this.graph.nodes.find(node => node.id === authorId);
        if (!authorNode) {
          authorNode = {
            id: authorId,
            type: 'author',
            label: author,
            data: { name: author, papers: [] },
            size: 15,
            color: '#4F46E5'
          };
          this.graph.nodes.push(authorNode);
        }
        
        // Add paper to author's papers list
        if (!authorNode.data.papers.includes(paperId)) {
          authorNode.data.papers.push(paperId);
          authorNode.size = Math.max(15, authorNode.data.papers.length * 3);
        }
        
        // Add authorship edge
        const edgeId = `${authorId}_authors_${paperId}`;
        if (!this.graph.edges.find(edge => edge.id === edgeId)) {
          this.graph.edges.push({
            id: edgeId,
            source: authorId,
            target: paperId,
            type: 'authored_by',
            weight: 1
          });
        }
      });
    }
    
    // Add topic nodes and edges
    if (analysisData.topics) {
      analysisData.topics.forEach((topic: string) => {
        const topicId = `topic_${topic.replace(/\s+/g, '_')}`;
        
        // Add or update topic node
        let topicNode = this.graph.nodes.find(node => node.id === topicId);
        if (!topicNode) {
          topicNode = {
            id: topicId,
            type: 'topic',
            label: topic,
            data: { topic, papers: [] },
            size: 12,
            color: '#10B981'
          };
          this.graph.nodes.push(topicNode);
        }
        
        // Add paper to topic's papers list
        if (!topicNode.data.papers.includes(paperId)) {
          topicNode.data.papers.push(paperId);
          topicNode.size = Math.max(12, topicNode.data.papers.length * 2);
        }
        
        // Add topic edge
        const edgeId = `${paperId}_contains_${topicId}`;
        if (!this.graph.edges.find(edge => edge.id === edgeId)) {
          this.graph.edges.push({
            id: edgeId,
            source: paperId,
            target: topicId,
            type: 'contains_topic',
            weight: 1
          });
        }
      });
    }
    
    // Add keyword nodes and edges
    if (analysisData.keywords) {
      analysisData.keywords.slice(0, 5).forEach((keyword: string) => {
        const keywordId = `keyword_${keyword.replace(/\s+/g, '_')}`;
        
        // Add or update keyword node
        let keywordNode = this.graph.nodes.find(node => node.id === keywordId);
        if (!keywordNode) {
          keywordNode = {
            id: keywordId,
            type: 'keyword',
            label: keyword,
            data: { keyword, papers: [] },
            size: 8,
            color: '#F59E0B'
          };
          this.graph.nodes.push(keywordNode);
        }
        
        // Add paper to keyword's papers list
        if (!keywordNode.data.papers.includes(paperId)) {
          keywordNode.data.papers.push(paperId);
          keywordNode.size = Math.max(8, keywordNode.data.papers.length * 1.5);
        }
        
        // Add keyword edge
        const edgeId = `${paperId}_contains_keyword_${keywordId}`;
        if (!this.graph.edges.find(edge => edge.id === edgeId)) {
          this.graph.edges.push({
            id: edgeId,
            source: paperId,
            target: keywordId,
            type: 'contains_topic',
            weight: 0.5
          });
        }
      });
    }
    
    // Update collaboration edges between authors
    this.updateCollaborationEdges(paperData.authors);
    
    // Update similarity edges between papers
    this.updateSimilarityEdges(paperId, analysisData);
    
    // Update metadata
    this.updateMetadata();
    
    return paperNode;
  }
  
  private static updateCollaborationEdges(authors: string[]) {
    if (!authors || authors.length < 2) return;
    
    for (let i = 0; i < authors.length; i++) {
      for (let j = i + 1; j < authors.length; j++) {
        const author1Id = `author_${authors[i].replace(/\s+/g, '_')}`;
        const author2Id = `author_${authors[j].replace(/\s+/g, '_')}`;
        const edgeId = `${author1Id}_collaborates_${author2Id}`;
        
        let edge = this.graph.edges.find(e => e.id === edgeId);
        if (!edge) {
          this.graph.edges.push({
            id: edgeId,
            source: author1Id,
            target: author2Id,
            type: 'collaborates_with',
            weight: 1
          });
        } else {
          edge.weight = (edge.weight || 0) + 1;
        }
      }
    }
  }
  
  private static updateSimilarityEdges(paperId: string, analysisData: any) {
    const paperNodes = this.graph.nodes.filter(node => node.type === 'paper' && node.id !== paperId);
    
    paperNodes.forEach(otherPaper => {
      const similarity = this.calculateSimilarity(analysisData, otherPaper.data.analysis);
      
      if (similarity > 0.3) { // Threshold for similarity
        const edgeId = `${paperId}_similar_${otherPaper.id}`;
        if (!this.graph.edges.find(edge => edge.id === edgeId)) {
          this.graph.edges.push({
            id: edgeId,
            source: paperId,
            target: otherPaper.id,
            type: 'similar_to',
            weight: similarity,
            label: `${Math.round(similarity * 100)}% similar`
          });
        }
      }
    });
  }
  
  private static calculateSimilarity(analysis1: any, analysis2: any): number {
    if (!analysis1 || !analysis2) return 0;
    
    const keywords1 = new Set(analysis1.keywords || []);
    const keywords2 = new Set(analysis2.keywords || []);
    const topics1 = new Set(analysis1.topics || []);
    const topics2 = new Set(analysis2.topics || []);
    
    // Calculate Jaccard similarity for keywords and topics
    const keywordIntersection = new Set([...keywords1].filter(k => keywords2.has(k)));
    const keywordUnion = new Set([...keywords1, ...keywords2]);
    const keywordSimilarity = keywordIntersection.size / keywordUnion.size;
    
    const topicIntersection = new Set([...topics1].filter(t => topics2.has(t)));
    const topicUnion = new Set([...topics1, ...topics2]);
    const topicSimilarity = topicIntersection.size / topicUnion.size;
    
    return (keywordSimilarity + topicSimilarity) / 2;
  }
  
  private static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Machine Learning': '#3B82F6',
      'Computer Science': '#6366F1',
      'Physics': '#8B5CF6',
      'Mathematics': '#A855F7',
      'Biology': '#10B981',
      'Chemistry': '#059669',
      'Engineering': '#DC2626',
      'Medicine': '#EA580C',
      'Psychology': '#D97706',
      'Economics': '#CA8A04',
      'Climate Science': '#65A30D',
      'Quantum Physics': '#7C3AED',
      'Biotechnology': '#059669',
      'Renewable Energy': '#16A34A',
      'Blockchain': '#2563EB'
    };
    
    return colors[category] || '#6B7280';
  }
  
  private static updateMetadata() {
    this.graph.metadata.updatedAt = new Date();
    this.graph.metadata.totalPapers = this.graph.nodes.filter(n => n.type === 'paper').length;
    this.graph.metadata.totalAuthors = this.graph.nodes.filter(n => n.type === 'author').length;
    this.graph.metadata.totalTopics = this.graph.nodes.filter(n => n.type === 'topic').length;
  }
  
  static searchNodes(query: string): GraphNode[] {
    const lowercaseQuery = query.toLowerCase();
    return this.graph.nodes.filter(node =>
      node.label.toLowerCase().includes(lowercaseQuery) ||
      (node.data.abstract && node.data.abstract.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  static getNodesByType(type: GraphNode['type']): GraphNode[] {
    return this.graph.nodes.filter(node => node.type === type);
  }
  
  static getConnectedNodes(nodeId: string): GraphNode[] {
    const connectedIds = new Set<string>();
    
    this.graph.edges.forEach(edge => {
      if (edge.source === nodeId) {
        connectedIds.add(edge.target);
      } else if (edge.target === nodeId) {
        connectedIds.add(edge.source);
      }
    });
    
    return this.graph.nodes.filter(node => connectedIds.has(node.id));
  }
  
  static exportGraph(): string {
    return JSON.stringify(this.graph, null, 2);
  }
  
  static importGraph(graphData: string): void {
    try {
      const parsed = JSON.parse(graphData);
      if (parsed.nodes && parsed.edges && parsed.metadata) {
        this.graph = parsed;
      }
    } catch (error) {
      console.error('Error importing graph:', error);
      throw new Error('Invalid graph data');
    }
  }
  
  static clearGraph(): void {
    this.graph = {
      nodes: [],
      edges: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalPapers: 0,
        totalAuthors: 0,
        totalTopics: 0
      }
    };
  }
  
  static getGraphStats() {
    const nodesByType = {
      papers: this.graph.nodes.filter(n => n.type === 'paper').length,
      authors: this.graph.nodes.filter(n => n.type === 'author').length,
      topics: this.graph.nodes.filter(n => n.type === 'topic').length,
      keywords: this.graph.nodes.filter(n => n.type === 'keyword').length,
      citations: this.graph.nodes.filter(n => n.type === 'citation').length
    };
    
    const edgesByType = {
      citations: this.graph.edges.filter(e => e.type === 'cites').length,
      authorships: this.graph.edges.filter(e => e.type === 'authored_by').length,
      topics: this.graph.edges.filter(e => e.type === 'contains_topic').length,
      similarities: this.graph.edges.filter(e => e.type === 'similar_to').length,
      collaborations: this.graph.edges.filter(e => e.type === 'collaborates_with').length
    };
    
    return {
      nodes: nodesByType,
      edges: edgesByType,
      total: {
        nodes: this.graph.nodes.length,
        edges: this.graph.edges.length
      }
    };
  }
}