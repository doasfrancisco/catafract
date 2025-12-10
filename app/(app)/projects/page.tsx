'use client';

import { redirect } from "next/navigation";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { analytics } from '@/lib/mixpanel';
import { useUserStore } from '@/app/store/useUserStore';
import { useProjectStore } from './store/useProjectStore';
import { useCanvasStore } from './canvas/[id]/store/useCanvasStore';
import Paywall from './components/Paywall';
import { Search, Plus, Workflow, Home, Image as ImageIcon, Video, Wand2, PenTool, Type, Folder, User, LogOut } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function ProjectsPage() {
    const { data: session, status } = useSession();
    const { userData, isUserLoading } = useUserStore();
    const { projectData, isProjectLoading, fetchProjectData } = useProjectStore();
    const { setCanvasData, setLoading } = useCanvasStore();
    const router = useRouter();

    const [showUserMenu, setShowUserMenu] = useState(false);



    useEffect(() => {
        if (!isUserLoading && isProjectLoading) {
            fetchProjectData(userData?.id!);
            analytics.trackProjectsLoaded(userData!.id);
        }
    }, [userData, projectData]);


    if (status === 'loading' || isUserLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (!session) {
        redirect('/login');
    }

    const handlePortal = () => {
        if (userData?.isPro) {
            window.location.href = '/api/portal';
        }
    }

    const handleSignOut = () => {
        analytics.trackSignOut();
        signOut();
    };

    const createNewProject = async () => {
        const projectResponse = await fetch('/api/user/project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData?.id,
                name: "Untitled Project"
            }),
        });
        const project = await projectResponse.json();

        const canvasResponse = await fetch('/api/user/project/canvas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: project.id
            }),
        });
        const canvas = await canvasResponse.json();

        setCanvasData({
            id: canvas.id,
            projectId: canvas.projectId,
            nodes: canvas.nodes,
            edges: canvas.edges,
        });
        setLoading(false);
        router.push(`/projects/canvas/${project.id}`);
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-black font-sans">
            {!userData?.isPro && (
                <Paywall />
            )}

            {/* Top Navigation Bar */}
            <div className="relative flex items-center justify-between px-6 py-4">
                {/* Left Side (Empty for now to balance if needed, or just rely on absolute center) */}
                <div className="w-1/3"></div>

                {/* Center Icons */}
                {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 bg-[#D9D9CD] p-2 rounded-lg">
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><Home className="w-4 h-4 text-gray-600" /></button>
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><ImageIcon className="w-4 h-4 text-gray-600" /></button>
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><Video className="w-4 h-4 text-gray-600" /></button>
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><Wand2 className="w-4 h-4 text-gray-600" /></button>
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><PenTool className="w-4 h-4 text-gray-600" /></button>
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><Type className="w-4 h-4 text-gray-600" /></button>
                    <button className="p-2 hover:bg-white rounded-md transition-colors"><Folder className="w-4 h-4 text-gray-600" /></button>
                </div> */}

                {/* Right Side */}
                <div className="flex items-center justify-end gap-4 w-1/3">
                    {userData!.isPro && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 hover: cursor-pointer transition-colors"
                            onClick={handlePortal}
                        >
                            Portal
                        </button>
                    )}
                    <div className="relative flex items-center gap-2">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:cursor-pointer hover:ring-gray-300 transition-all"
                        >
                            {userData?.image ? (
                                <img
                                    src={userData.image}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white">
                                    <User className="w-5 h-5" />
                                </div>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                <div className="p-1">
                                    <button
                                        onClick={() => handleSignOut()}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:cursor-pointer rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-10">
                <div className="flex flex-col items-center mb-16">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <Workflow className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold">Nodes</h1>
                    </div>
                </div>

                {/* Community Blueprints */}
                {/* <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Community Blueprints</h2>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&larr;</button>
                            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&rarr;</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        {[
                            { title: "Banana Bench", author: "Krea", desc: "Use your own prompt to compare Nano Banana Pro versus the previous version side by side.", color: "bg-blue-900" },
                            { title: "Mythical Creature", author: "@numanuk", desc: "Create character consistent videos of mythical creatures.", color: "bg-purple-100" },
                            { title: "Selfie to Fine Art", author: "Krea", desc: "Upload a selfie and turn it into a stunning black and white photo and video.", color: "bg-gray-900" },
                            { title: "Sneaker Campaign", author: "Krea", desc: "Create a poster, video, and new product shots for a whole ad campaign from a single photo.", color: "bg-green-900" },
                        ].map((item, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className={`aspect-video rounded-xl ${item.color} mb-3 overflow-hidden relative`}>
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">New</div>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.desc}</p>
                                <p className="text-xs text-gray-400 font-medium">By {item.author}</p>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Recent Projects */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Projects</h2>
                        {/* <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search projects" className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Last viewed</button>
                        </div> */}
                    </div>

                    {isProjectLoading ? (
                        <div className="flex items-center justify-center h-screen">
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6">
                            <button
                                onClick={() => createNewProject()}
                                className="aspect-square bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all group hover:cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </button>
                            {projectData?.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => router.push(`/projects/canvas/${item.id}`)}
                                    className="aspect-square bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all group hover:cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium">{item.createdDate!.toLocaleDateString()}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}