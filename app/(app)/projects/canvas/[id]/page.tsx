"use client";

import { useState, useEffect, useCallback, useRef, MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
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
    Download,
    Star,
} from "lucide-react";

import { BookTextIcon, BookTextIconHandle } from '@/app/components/book-text';
import { useDebounce } from 'use-debounce';
import UploadNode from './components/UploadNode';
import GenerationNode from './components/GenerationNode';
import EmptyState from './components/EmptyState';
import TemplateModal from './components/TemplateModal';
import { ImageNode, ImageNodeData } from './types';
import { analytics } from '@/lib/mixpanel';
import { compressWithJsquash } from '@/lib/imageCompress';
import { useUserStore } from "@/app/store/useUserStore";
import { useCanvasStore } from "../../canvas/[id]/store/useCanvasStore";
import heic2any from "heic2any";

const nodeTypes: NodeTypes = {
    upload: UploadNode,
    generation: GenerationNode,
};

function NodeMenuBar({ cursorInfo }: { cursorInfo: { nodeId: string, xScreen: number, yScreen: number } }) {
    const { getNode } = useReactFlow();

    const onDownloadClick = async (nodeId: string) => {
        const node = getNode(nodeId);
        if (node && node.data.image) {
            // If this worked as intented when generating image. Maybe i'm doing something here that's quite inneficient
            const response = await fetch(node.data.image as string);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image-${nodeId}.jpg`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div
            className="absolute bg-[#FDFCF8] rounded-xl shadow-xl border border-gray-200 w-64 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: cursorInfo.yScreen, left: cursorInfo.xScreen }}
        >
            <div className="p-2 space-y-1">
                {!!getNode(cursorInfo.nodeId)?.data.image && (
                    <button
                        onClick={async () => await onDownloadClick(cursorInfo.nodeId)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors text-gray-700"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium">Download</span>
                    </button>
                )}
                <button
                    onClick={() => (console.log('Favorite'))}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left transition-colors text-gray-700"
                >
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">Favorite</span>
                </button>
            </div>
        </div>
    );
}

function Canvas() {
    const { data: session, status } = useSession();
    const { id: projectId } = useParams<{ id: string }>();
    const { userData } = useUserStore();
    const { canvasData, isCanvasLoading, fetchCanvasData, resetCanvasData } = useCanvasStore()
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();
    const [nodes, setNodes] = useState<ImageNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const [debouncedNodes] = useDebounce(nodes, 1000);
    const [debouncedEdges] = useDebounce(edges, 1000);

    const [nodeId, setNodeId] = useState(1);
    const [showProjectMenu, setShowProjectMenu] = useState(false);
    const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const newFeatureIconRef = useRef<BookTextIconHandle>(null);

    const [cursorInfo, setCursorInfo] = useState({
        isRightClickCanvas: false,
        isRightClickNode: false,
        nodeId: '',
        xScreen: 0,
        yScreen: 0
    });
    const flowPositionRef = useRef({ x: 0, y: 0 });
    const { screenToFlowPosition, getNodes } = useReactFlow();

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

    const addUploadNode = useCallback((imageUrl: string, xFlow: number, yFlow: number) => {
        const id = `upload-${nodeId}`;
        const newNode: ImageNode = {
            id,
            type: 'upload',
            position: { x: xFlow, y: yFlow },
            data: { type: 'upload', image: imageUrl },
        };
        setNodes((nds) => [...nds, newNode]);
        setNodeId((prev) => prev + 1);
        analytics.trackNodeAdded('upload');
    }, [nodeId]);

    const addGenerationNode = useCallback((xFlow: number, yFlow: number) => {
        const id = `generation-${nodeId}`;
        const newNode: ImageNode = {
            id,
            type: 'generation',
            position: { x: xFlow, y: yFlow },
            data: { type: 'generation' },
        };
        setNodes((nds) => [...nds, newNode]);
        setNodeId((prev) => prev + 1);
        analytics.trackNodeAdded('generation');
    }, [nodeId]);

    const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processImageUpload(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleContextMenu = useCallback((e: MouseEvent | ReactMouseEvent) => {
        e.preventDefault();
        const flowPosition = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        flowPositionRef.current = flowPosition;
        setCursorInfo({
            ...cursorInfo,
            isRightClickCanvas: true,
            isRightClickNode: false,
            xScreen: e.clientX,
            yScreen: e.clientY,
        });
    }, []);

    const handleNodeContextMenu = useCallback((e: ReactMouseEvent, node: ImageNode) => {
        e.preventDefault();
        const flowPosition = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        flowPositionRef.current = flowPosition;
        setCursorInfo({
            isRightClickCanvas: false,
            isRightClickNode: true,
            nodeId: node.id,
            xScreen: e.clientX,
            yScreen: e.clientY,
        });
    }, []);

    const processImageUpload = useCallback(async (file: File, nodeId?: string) => {
        try {
            let fileToCompress = file;
            if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/png",
                }) as Blob;
                fileToCompress = new File([convertedBlob], file.name.replace(/\.heic$/i, ".png"), { type: "image/png" });
            }
            const compressed = await compressWithJsquash(fileToCompress);
            const formData = new FormData();
            formData.append('file', compressed);
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            const { url } = await response.json();


            if (nodeId) {
                setNodes((nds) =>
                    nds.map((n) => {
                        if (n.id === nodeId) {
                            return {
                                ...n,
                                data: {
                                    ...n.data,
                                    image: url,
                                },
                            };
                        }
                        return n;
                    })
                );
                return;
            }

            const { x, y } = flowPositionRef.current;
            addUploadNode(url, x, y);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload image. Please try again.');
        }
    }, [addUploadNode]);

    const onCanvasClick = useCallback(() => {
        if (cursorInfo.isRightClickCanvas || cursorInfo.isRightClickNode) {
            flowPositionRef.current = { x: 0, y: 0 };
            setCursorInfo({
                ...cursorInfo,
                isRightClickCanvas: false,
                isRightClickNode: false,
                xScreen: 0, yScreen: 0
            });
        }
        if (showProjectMenu) {
            setShowProjectMenu(false);
        }
    }, [cursorInfo, showProjectMenu]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }, []);

    const onDrop = useCallback(async (event: React.DragEvent) => {
        event.preventDefault();
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const targetNode = getNodes().find((n) => {
            const width = n.measured?.width ?? n.width ?? 150;
            const height = n.measured?.height ?? n.height ?? 150;

            return (
                position.x >= n.position!.x &&
                position.x <= n.position!.x + width &&
                position.y >= n.position!.y &&
                position.y <= n.position!.y + height
            )
        });

        flowPositionRef.current = position;
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith(".heic")) {
                    await processImageUpload(file, targetNode?.id);
                }
            }
        }
    }, [screenToFlowPosition, processImageUpload]);

    const saveTemplate = async (name: string) => {
        const templateData = {
            templateName: name,
            user: userData,
            canvas: {
                nodes,
                edges,
                viewport: { x: 0, y: 0, zoom: 1 }
            }
        };

        try {
            const res = await fetch('/api/upload/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateData)
            });
            if (res.ok) {
                setTemplateModalOpen(false);
            }
        } catch (error) {
            console.error(error);
        }
    }

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
        if (!projectId) return;
        fetchCanvasData(projectId);
        analytics.trackCanvasLoaded();

        return () => {
            resetCanvasData();
        };
    }, [projectId]);

    useEffect(() => {
        if (isCanvasLoading) return;
        const nodes = canvasData?.nodes || [];
        const edges = canvasData?.edges || [];
        setNodes(nodes);
        setEdges(edges);

        const maxId = nodes.reduce((max, node) => {
            const id = parseInt(node.id.split('-')[1]);
            return Math.max(max, id);
        }, 0);
        setNodeId(maxId + 1);
        setIsInitialized(true);
    }, [isCanvasLoading]);

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
                const response = await fetch('/api/image', {
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
                            ? { ...node, data: { ...node.data, image: data.imageUrl, isGenerating: false } }
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

    useEffect(() => {
        const saveCanvas = async () => {
            if (!canvasData || nodes !== debouncedNodes || !isInitialized) return;
            const canvasInfo = {
                id: canvasData.id,
                projectId: canvasData.projectId,
                nodes: debouncedNodes,
                edges: debouncedEdges
            };
            await fetch('/api/user/project/canvas', {
                method: 'POST',
                body: JSON.stringify(canvasInfo)
            });
        };

        saveCanvas();
    }, [debouncedNodes, debouncedEdges, canvasData, isInitialized]);
    //canvasData might cause infinite loop. be wary

    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith('image/') || item.type === "") {
                    const file = await item.getAsFile();
                    if (file && (file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".heic"))) {
                        e.preventDefault();
                        const center = screenToFlowPosition({
                            x: window.innerWidth / 2,
                            y: window.innerHeight / 2
                        });
                        flowPositionRef.current = center;
                        processImageUpload(file);
                    }
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [processImageUpload])

    if (status === 'loading' || !isInitialized) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="h-screen w-screen bg-[#FDFCF8] relative overflow-hidden font-sans">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onFileInputChange}
            />

            {nodes.length === 0 && (
                <EmptyState
                    onUpload={() => fileInputRef.current?.click()}
                    onAddGeneration={() => addGenerationNode(0, 0)}
                />
            )}

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
                                <button
                                    onMouseEnter={() => newFeatureIconRef.current?.startAnimation()}
                                    onMouseLeave={() => newFeatureIconRef.current?.stopAnimation()}
                                    onClick={() => setTemplateModalOpen(true)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <BookTextIcon ref={newFeatureIconRef} size={16} />
                                    Publish Template
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
                onClick={onCanvasClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onPaneContextMenu={handleContextMenu}
                    onNodeContextMenu={handleNodeContextMenu}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.001}
                    maxZoom={3.5}
                    proOptions={{ hideAttribution: true }}
                />
            </div>

            {/* Context Menu */}
            {cursorInfo.isRightClickCanvas && (
                <div
                    className="absolute bg-[#FDFCF8] rounded-xl shadow-xl border border-gray-200 w-64 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: cursorInfo.yScreen, left: cursorInfo.xScreen }}
                >
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => {
                                fileInputRef.current?.click();
                                setCursorInfo({
                                    ...cursorInfo,
                                    isRightClickCanvas: false,
                                    isRightClickNode: false
                                });
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
                                    addGenerationNode(flowPositionRef.current.x, flowPositionRef.current.y);
                                    setCursorInfo({
                                        ...cursorInfo,
                                        isRightClickCanvas: false,
                                        isRightClickNode: false
                                    });
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

            {cursorInfo.isRightClickNode && (
                <NodeMenuBar cursorInfo={cursorInfo} />
            )}

            <TemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setTemplateModalOpen(false)}
                onSave={saveTemplate}
            />
        </div>
    );
}

export default function CanvasPage() {
    return (
        <ReactFlowProvider>
            <Canvas />
        </ReactFlowProvider>
    );
}