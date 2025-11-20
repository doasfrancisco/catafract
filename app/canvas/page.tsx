'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import UploadNode from './components/UploadNode';
import GenerationNode from './components/GenerationNode';
import { ImageNode, ImageNodeData } from './types';
import { analytics } from '@/lib/mixpanel';

const nodeTypes: NodeTypes = {
  upload: UploadNode,
  generation: GenerationNode,
};

export default function App() {
  const { data: session, status } = useSession();
  const [isPro, setIsPro] = useState(false);
  const [userData, setUserData] = useState<{ id?: string; email?: string; name?: string } | null>(null);
  const router = useRouter();
  const [nodes, setNodes] = useState<ImageNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeId, setNodeId] = useState(1);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as ImageNode[]),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add Upload Node
  const addUploadNode = useCallback(() => {
    const id = `upload-${nodeId}`;
    const newNode: ImageNode = {
      id,
      type: 'upload',
      position: { x: 100, y: 100 + nodeId * 50 },
      data: { type: 'upload' },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((prev) => prev + 1);
    analytics.trackNodeAdded('upload');
  }, [nodeId]);

  // Add Generation Node
  const addGenerationNode = useCallback(() => {
    const id = `generation-${nodeId}`;
    const newNode: ImageNode = {
      id,
      type: 'generation',
      position: { x: 400, y: 100 + nodeId * 50 },
      data: { type: 'generation' },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((prev) => prev + 1);
    analytics.trackNodeAdded('generation');
  }, [nodeId]);

  // Handle node data updates
  useEffect(() => {
    const handleNodeDataUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{
        nodeId: string;
        data: Partial<ImageNodeData>;
      }>;
      const { nodeId, data } = customEvent.detail;

      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
    };

    window.addEventListener('nodeDataUpdate', handleNodeDataUpdate);
    return () => window.removeEventListener('nodeDataUpdate', handleNodeDataUpdate);
  }, []);


  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/user/status');
        const data = await res.json();
        setIsPro(data.isPro);
        setUserData(data);
        if (data.id) {
          analytics.identify(data.id);
        }
      } catch (e) {
        console.error('Failed to check pro status', e);
      }
    };
    checkStatus();
    analytics.trackCanvasLoaded();
  }, []);

  // Handle image generation
  useEffect(() => {
    const handleGenerateImage = async (event: Event) => {
      const customEvent = event as CustomEvent<{ nodeId: string; prompt: string }>;
      const { nodeId, prompt } = customEvent.detail;

      // Find all connected input nodes
      const connectedEdges = edges.filter((edge) => edge.target === nodeId);
      const inputImages: string[] = [];

      connectedEdges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode?.data.image) {
          inputImages.push(sourceNode.data.image);
        }
      });

      if (inputImages.length === 0) {
        alert('Please connect at least one image node as input');
        return;
      }

      try {
        // Update node to show generating state
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, isGenerating: true } }
              : node
          )
        );

        analytics.trackImageGeneration({
          prompt: prompt,
          inputNodeCount: inputImages.length,
          status: 'started',
        });

        // Call API to generate image
        const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: inputImages, prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate AI image');
        }

        const data = await response.json();

        // Update node with generated image
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, image: data.image, isGenerating: false } }
              : node
          )
        );

        analytics.trackImageGeneration({
          prompt: prompt,
          inputNodeCount: inputImages.length,
          status: 'success',
        });
      } catch (error) {
        console.error('Error generating image:', error);
        alert('Failed to generate image. Check console for details.');

        // Reset generating state
        setNodes((nds) =>
          nds.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, isGenerating: false } }
              : node
          )
        );

        analytics.trackImageGeneration({
          prompt: prompt,
          inputNodeCount: inputImages.length,
          status: 'failure',
        });
      }
    };

    window.addEventListener('generateImage', handleGenerateImage);
    return () => window.removeEventListener('generateImage', handleGenerateImage);
  }, [nodes, edges]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleUpgrade = () => {
    analytics.trackUpgradeClicked(isPro);
    if (isPro) {
      window.location.href = '/api/portal';
    } else {
      // Replace with your actual product ID or just link to checkout
      // If you have a specific product ID, add ?products=PRODUCT_ID
      const productId = 'e1c52c1a-e8e0-4340-bda2-7cfb368f74ae';

      const params = new URLSearchParams();
      params.append('products', productId);

      if (userData?.id) params.append('customerExternalId', userData.id);
      if (userData?.email) params.append('customerEmail', userData.email);
      if (userData?.name) params.append('customerName', userData.name);

      window.location.href = `/api/checkout?${params.toString()}`;
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 10,
          display: 'flex',
          gap: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={addUploadNode}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Upload image
        </button>
        <button
          onClick={addGenerationNode}
          style={{
            padding: '8px 16px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          + Generation Node
        </button>
        <button
          onClick={handleUpgrade}
          disabled={isPro}
          style={{
            padding: '8px 16px',
            backgroundColor: isPro ? '#10b981' : '#f59e0b', // Green for Pro, Amber for Upgrade
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          {isPro ? '✨ Pro' : '⚡ Upgrade'}
        </button>
      </div>

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}
