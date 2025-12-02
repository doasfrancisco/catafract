'use client';

import { redirect } from "next/navigation";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { analytics } from '@/lib/mixpanel';
import { useUserStore } from '@/app/store/useUserStore';
import { useProjectStore } from '@/app/projects/store/useProjectStore';

import { Search, Plus, Workflow, Home, Image as ImageIcon, Video, Wand2, PenTool, Type, Folder } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function ProjectsPage() {
    const { data: session, status } = useSession();
    const { userData, isUserLoading } = useUserStore();
    const { projectData, isProjectLoading, fetchProjectData } = useProjectStore();
    const router = useRouter();



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

    const handleUpgrade = () => {
        // analytics.trackUpgradeClicked(isPro);
        if (userData?.isPro) {
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

    const createNewProject = async () => {
        const response = await fetch('/api/user/project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData?.id,
                name: "Untitled Project"
            }),
        });
        const project = await response.json();
        router.push(`/projects/canvas/${project.id}`);
    };

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-black font-sans">
            {/* Top Navigation Bar */}
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
                {/* <div className="flex items-center justify-end gap-4 w-1/3"> */}
                {/* <div className="px-3 py-1.5 bg-[#D9D9CD] rounded-full text-xs font-medium text-gray-600">API Waitlist</div> */}
                {/* <button className="p-2 hover:bg-gray-100 rounded-full"><Search className="w-4 h-4" /></button> */}
                {/* <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        disabled={isPro}
                        onClick={handleUpgrade}
                    >
                        {isPro ? 'Already Pro' : 'Upgrade New'}
                    </button> */}
                {/* </div> */}
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