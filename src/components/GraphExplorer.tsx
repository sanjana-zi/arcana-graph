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
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Maximize2, Download } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Attention Mechanisms in Neural Networks',
      citations: 1247,
      year: 2023,
      type: 'research-paper'
    } as any,
    style: {
      background: 'hsl(240 84% 24%)',
      color: 'white',
      border: '2px solid hsl(240 100% 75%)',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '12px',
      width: 180,
    },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 300 },
    data: { 
      label: 'Transformer Architecture Analysis',
      citations: 892,
      year: 2022,
      type: 'review-paper'
    },
    style: {
      background: 'hsl(260 60% 65%)',
      color: 'white',
      border: '2px solid hsl(260 100% 80%)',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '12px',
      width: 180,
    },
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 300 },
    data: { 
      label: 'Self-Supervised Learning Methods',
      citations: 534,
      year: 2023,
      type: 'research-paper'
    },
    style: {
      background: 'hsl(180 100% 70%)',
      color: 'hsl(240 15% 9%)',
      border: '2px solid hsl(180 100% 80%)',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '12px',
      width: 180,
    },
  },
  {
    id: '4',
    type: 'default',
    position: { x: 250, y: 500 },
    data: { 
      label: 'Vision-Language Models',
      citations: 723,
      year: 2024,
      type: 'research-paper'
    },
    style: {
      background: 'hsl(25 95% 58%)',
      color: 'white',
      border: '2px solid hsl(25 100% 70%)',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '12px',
      width: 180,
    },
  },
  {
    id: '5',
    type: 'default',
    position: { x: 600, y: 200 },
    data: { 
      label: 'Multimodal Learning Survey',
      citations: 445,
      year: 2023,
      type: 'survey-paper'
    },
    style: {
      background: 'hsl(120 60% 50%)',
      color: 'white',
      border: '2px solid hsl(120 70% 60%)',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '12px',
      width: 180,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: 'hsl(240 84% 24%)', strokeWidth: 2 },
    label: 'cites',
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: 'hsl(260 60% 65%)', strokeWidth: 2 },
    label: 'related',
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    style: { stroke: 'hsl(180 100% 70%)', strokeWidth: 2 },
    label: 'extends',
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    style: { stroke: 'hsl(25 95% 58%)', strokeWidth: 2 },
    label: 'includes',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: true,
    style: { stroke: 'hsl(120 60% 50%)', strokeWidth: 2 },
    label: 'surveys',
  },
];

export const GraphExplorer = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-screen bg-gradient-graph flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Research Graph Explorer</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search papers, authors, concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Graph Controls</h3>
              <Button size="sm" variant="outline">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Research Papers</Badge>
              <Badge variant="outline">Reviews</Badge>
              <Badge variant="outline">Surveys</Badge>
            </div>
          </div>

          {selectedNode && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Selected Paper</h3>
              <h4 className="text-sm font-medium mb-2">{selectedNode.data.label as string}</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Citations: {selectedNode.data.citations as number}</div>
                <div>Year: {selectedNode.data.year as number}</div>
                <div>Type: {selectedNode.data.type as string}</div>
              </div>
              <div className="mt-4 space-y-2">
                <Button size="sm" className="w-full">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Find Similar
                </Button>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Export Options</h3>
            <Button size="sm" variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Graph
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-left"
          style={{ background: 'transparent' }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Controls 
            position="top-right"
            style={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <MiniMap 
            position="bottom-right"
            style={{
              background: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            nodeColor="hsl(240 84% 24%)"
            maskColor="hsl(var(--background) / 0.8)"
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={12} 
            size={1}
            color="hsl(var(--border))"
          />
        </ReactFlow>

        {/* Floating Stats */}
        <div className="absolute top-6 left-6 bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-card">
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-muted-foreground">Papers:</span>
              <span className="ml-1 font-semibold">{nodes.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Connections:</span>
              <span className="ml-1 font-semibold">{edges.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Citations:</span>
              <span className="ml-1 font-semibold">
                {nodes.reduce((sum, node) => sum + ((node.data.citations as number) || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};