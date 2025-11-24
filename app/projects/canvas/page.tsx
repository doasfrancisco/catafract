"use client";

import { useState, useEffect, useCallback, MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
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
import {
    MousePointer2,
    Hand,
    Move,
    Moon,
    Upload,
    Image as ImageIcon,
    Type,
    Sparkles,
    Maximize,
    ChevronDown,
    Undo,
    Redo,
    ArrowLeft,
} from "lucide-react";

const nodeTypes: NodeTypes = {
    upload: UploadNode,
    generation: GenerationNode,
};

export default function CanvasPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [nodes, setNodes] = useState<ImageNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [nodeId, setNodeId] = useState(1);
    const [showProjectMenu, setShowProjectMenu] = useState(false);

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        visible: boolean;
    }>({ x: 0, y: 0, visible: false });

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

    const handleContextMenu = useCallback((e: ReactMouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    }, []);

    const onCanvasClick = useCallback(() => {
        if (contextMenu.visible) {
            setContextMenu({ ...contextMenu, visible: false });
        }
        if (showProjectMenu) {
            setShowProjectMenu(false);
        }
    }, [contextMenu, showProjectMenu]);

    if (status === 'loading') {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="h-screen w-screen bg-[#FDFCF8] relative overflow-hidden font-sans">
            {/* Dotted Background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Top Left Project Name */}
            <div className="absolute top-4 left-4 z-10">
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowProjectMenu(!showProjectMenu);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                            <Image
                                src="/assets/logo.svg"
                                alt="Logo"
                                width={18}
                                height={18}
                            />
                        </div>
                        <span className="font-medium text-sm">Project</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showProjectMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showProjectMenu && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1">
                                <button
                                    onClick={() => router.push('/projects')}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Projects
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Left Toolbar */}
            {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 z-10">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                    <MousePointer2 className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                    <Hand className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                    <Move className="w-5 h-5" />
                </button>
                <div className="h-px bg-gray-200 my-1" />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                    <Moon className="w-5 h-5" />
                </button>
            </div> */}

            {/* Bottom Left Undo/Redo */}
            {/* <div className="absolute bottom-4 left-4 flex gap-2 text-gray-400 z-10">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                    <Undo className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
                    <Redo className="w-5 h-5" />
                </button>
            </div> */}

            {/* Main Canvas Area (Interactive for Context Menu) */}
            <div
                className="w-full h-full"
                onContextMenu={handleContextMenu}
                onClick={onCanvasClick}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={{ hideAttribution: true }}
                />
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className="absolute bg-[#FDFCF8] rounded-xl shadow-xl border border-gray-200 w-64 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => {
                                addUploadNode();
                                setContextMenu({ ...contextMenu, visible: false });
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors text-gray-700"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">Upload</span>
                        </button>
                    </div>

                    <div className="h-px bg-gray-200 mx-2" />

                    <div className="p-3">
                        <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
                            Nodes
                        </div>
                        <div className="space-y-1">
                            <button
                                onClick={() => {
                                    addGenerationNode();
                                    setContextMenu({ ...contextMenu, visible: false });
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors text-gray-700"
                            >
                                <div className="w-6 h-6 bg-purple-900 rounded flex items-center justify-center">
                                    <ImageIcon className="w-3 h-3 text-purple-400" />
                                </div>
                                <span className="text-sm font-medium">Image Generator</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}