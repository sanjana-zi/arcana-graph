import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraphService, GraphNode, GraphEdge } from '@/services/GraphService';
import { Search, Filter, Download, Upload, Maximize2, RotateCcw } from 'lucide-react';

interface InteractiveGraphProps {
  onNodeSelect?: (node: GraphNode | null) => void;
}

const nodeTypeColors = {
  paper: '#3B82F6',
  author: '#4F46E5', 
  topic: '#10B981',
  keyword: '#F59E0B',
  citation: '#EF4444'
};

export const InteractiveGraph = ({ onNodeSelect }: InteractiveGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [graphStats, setGraphStats] = useState(GraphService.getGraphStats());

  // Update graph when data changes
  useEffect(() => {
    updateGraphVisualization();
  }, []);

  const updateGraphVisualization = useCallback(() => {
    const graph = GraphService.getGraph();
    
    // Convert graph nodes to ReactFlow nodes
    const reactFlowNodes: Node[] = graph.nodes.map((node, index) => ({
      id: node.id,
      type: 'default',
      position: node.position || { 
        x: Math.random() * 800, 
        y: Math.random() * 600 
      },
      data: { 
        label: node.label.length > 30 ? node.label.substring(0, 30) + '...' : node.label,
        originalNode: node
      },
      style: {
        background: node.color || nodeTypeColors[node.type],
        color: 'white',
        border: '2px solid transparent',
        borderRadius: '8px',
        fontSize: '12px',
        width: Math.max(100, (node.size || 10) * 3),
        height: Math.max(40, (node.size || 10) * 1.5)
      }
    }));

    // Convert graph edges to ReactFlow edges
    const reactFlowEdges: Edge[] = graph.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      style: { 
        stroke: getEdgeColor(edge.type),
        strokeWidth: Math.max(1, (edge.weight || 1) * 2)
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: getEdgeColor(edge.type)
      },
      label: edge.label,
      labelStyle: { fontSize: '10px', fill: '#666' }
    }));

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setGraphStats(GraphService.getGraphStats());
  }, [setNodes, setEdges]);

  const getEdgeColor = (type: string): string => {
    const colors: Record<string, string> = {
      'authored_by': '#4F46E5',
      'contains_topic': '#10B981',
      'similar_to': '#F59E0B',
      'collaborates_with': '#8B5CF6',
      'cites': '#EF4444'
    };
    return colors[type] || '#6B7280';
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const graphNode = node.data.originalNode as GraphNode;
    setSelectedNode(graphNode);
    onNodeSelect?.(graphNode);
    
    // Highlight connected nodes
    const connectedNodes = GraphService.getConnectedNodes(node.id);
    const connectedIds = new Set([node.id, ...connectedNodes.map(n => n.id)]);
    
    setNodes(nodes => nodes.map(n => ({
      ...n,
      style: {
        ...n.style,
        border: connectedIds.has(n.id) ? '3px solid #FF6B6B' : '2px solid transparent',
        opacity: connectedIds.has(n.id) ? 1 : 0.6
      }
    })));
    
    setEdges(edges => edges.map(e => ({
      ...e,
      style: {
        ...e.style,
        opacity: (connectedIds.has(e.source) && connectedIds.has(e.target)) ? 1 : 0.3
      }
    })));
  }, [onNodeSelect, setNodes, setEdges]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      updateGraphVisualization();
      return;
    }
    
    const searchResults = GraphService.searchNodes(searchQuery);
    const resultIds = new Set(searchResults.map(n => n.id));
    
    setNodes(nodes => nodes.map(n => ({
      ...n,
      style: {
        ...n.style,
        opacity: resultIds.has(n.id) ? 1 : 0.3,
        border: resultIds.has(n.id) ? '3px solid #10B981' : '2px solid transparent'
      }
    })));
  }, [searchQuery, setNodes, updateGraphVisualization]);

  const filterByType = useCallback((type: string) => {
    setSelectedNodeType(type);
    
    if (type === 'all') {
      updateGraphVisualization();
      return;
    }
    
    const filteredNodes = GraphService.getNodesByType(type as any);
    const filteredIds = new Set(filteredNodes.map(n => n.id));
    
    setNodes(nodes => nodes.map(n => ({
      ...n,
      style: {
        ...n.style,
        opacity: filteredIds.has(n.id) ? 1 : 0.2
      }
    })));
  }, [setNodes, updateGraphVisualization]);

  const resetView = useCallback(() => {
    setSearchQuery('');
    setSelectedNodeType('all');
    setSelectedNode(null);
    updateGraphVisualization();
  }, [updateGraphVisualization]);

  const exportGraph = useCallback(() => {
    const graphData = GraphService.exportGraph();
    const blob = new Blob([graphData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research-graph.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Auto-refresh graph when new papers are added
  useEffect(() => {
    const interval = setInterval(updateGraphVisualization, 5000);
    return () => clearInterval(interval);
  }, [updateGraphVisualization]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Knowledge Graph Explorer</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
              <Button variant="outline" size="sm" onClick={exportGraph}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search papers, authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              {['all', 'paper', 'author', 'topic', 'keyword'].map(type => (
                <Button
                  key={type}
                  variant={selectedNodeType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => filterByType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Graph Stats */}
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{graphStats.nodes.papers}</div>
              <div className="text-sm text-muted-foreground">Papers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{graphStats.nodes.authors}</div>
              <div className="text-sm text-muted-foreground">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{graphStats.nodes.topics}</div>
              <div className="text-sm text-muted-foreground">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{graphStats.edges.collaborations}</div>
              <div className="text-sm text-muted-foreground">Collaborations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{graphStats.edges.similarities}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graph Visualization */}
      <Card className="h-[600px]">
        <CardContent className="p-0 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            style={{ width: '100%', height: '100%' }}
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => String(node.style?.background || '#6B7280')}
              className="bg-background border border-border rounded"
            />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedNode.color || nodeTypeColors[selectedNode.type] }}
              />
              {selectedNode.label}
              <Badge variant="secondary">{selectedNode.type}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                {selectedNode.type === 'paper' && <TabsTrigger value="analysis">Analysis</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <div className="space-y-2">
                  {selectedNode.type === 'paper' && (
                    <>
                      <div><strong>Title:</strong> {selectedNode.data.title}</div>
                      <div><strong>Authors:</strong> {selectedNode.data.authors?.join(', ')}</div>
                      <div><strong>Year:</strong> {selectedNode.data.year}</div>
                      <div><strong>Category:</strong> {selectedNode.data.category}</div>
                      {selectedNode.data.abstract && (
                        <div><strong>Abstract:</strong> {selectedNode.data.abstract.substring(0, 200)}...</div>
                      )}
                    </>
                  )}
                  {selectedNode.type === 'author' && (
                    <>
                      <div><strong>Name:</strong> {selectedNode.data.name}</div>
                      <div><strong>Papers:</strong> {selectedNode.data.papers?.length || 0}</div>
                    </>
                  )}
                  {selectedNode.type === 'topic' && (
                    <>
                      <div><strong>Topic:</strong> {selectedNode.data.topic}</div>
                      <div><strong>Related Papers:</strong> {selectedNode.data.papers?.length || 0}</div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="connections" className="mt-4">
                <div className="space-y-2">
                  {GraphService.getConnectedNodes(selectedNode.id).map(node => (
                    <div key={node.id} className="flex items-center gap-2 p-2 border rounded">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: node.color || nodeTypeColors[node.type] }}
                      />
                      <span className="text-sm">{node.label}</span>
                      <Badge variant="outline" className="text-xs">{node.type}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {selectedNode.type === 'paper' && (
                <TabsContent value="analysis" className="mt-4">
                  <div className="space-y-4">
                    {selectedNode.data.analysis?.summary && (
                      <div>
                        <strong>AI Summary:</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedNode.data.analysis.summary}
                        </p>
                      </div>
                    )}
                    {selectedNode.data.analysis?.keywords && (
                      <div>
                        <strong>Keywords:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedNode.data.analysis.keywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};