'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/app/store/useUserStore';
import { useProjectStore } from './store/useProjectStore';
import { useCanvasStore } from './canvas/[id]/store/useCanvasStore';
import { Plus, Workflow, Image as ImageIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { analytics } from '@/lib/mixpanel';

export default function ProjectsPage() {
    const { userData, isUserLoading } = useUserStore();
    const { projectData, isProjectLoading, fetchProjectData } = useProjectStore();
    const [templates, setTemplates] = useState<any>([]);
    const { setCanvasData, setLoading } = useCanvasStore();
    const router = useRouter();

    const createNewProject = async (template?: any) => {
        const projectResponse = await fetch('/api/user/project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userData?.id,
                name: template ? template.templateName : "Untitled Project"
            }),
        });
        const project = await projectResponse.json();

        const canvasResponse = await fetch('/api/user/project/canvas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nodes: template ? template.canvas.nodes : [],
                edges: template ? template.canvas.edges : [],
                projectId: project.id,
                templateId: template?.id
            }),
        });
        const canvas = await canvasResponse.json();

        setCanvasData({
            id: canvas.id,
            projectId: canvas.projectId,
            nodes: template ? template.canvas.nodes : canvas.nodes,
            edges: template ? template.canvas.edges : canvas.edges,
        });
        setLoading(false);
        router.push(`/projects/canvas/${project.id}`);
    };

    const getGradientForName = (name: string) => {
        const GRADIENTS = [
            "bg-gradient-to-br from-purple-600 via-indigo-500 to-indigo-900",
            "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
            "bg-gradient-to-br from-rose-500 via-red-400 to-orange-400",
            "bg-gradient-to-br from-emerald-500 via-green-400 to-lime-400",
            "bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-900",
            "bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % GRADIENTS.length;
        return GRADIENTS[index];
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            const templatesResponse = await fetch('/api/upload/templates');
            const templates = await templatesResponse.json();
            setTemplates(templates);
        };
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (!isUserLoading && isProjectLoading) {
            fetchProjectData(userData?.id!);
            analytics.trackProjectsLoaded(userData!.id);
        }
    }, [userData, projectData]);

    return (
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
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Community Templates</h2>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&larr;</button>
                        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">&rarr;</button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6">
                    {templates.map((template: any, i: number) => (
                        <button
                            key={i}
                            onClick={() => createNewProject(template)}
                            className="group cursor-pointer text-left w-full"
                        >
                            <div className={`aspect-video rounded-xl mb-3 overflow-hidden relative ${getGradientForName(template.templateName)}`}>
                                <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded uppercase tracking-wider">New</div>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{template.templateName}</h3>
                            <p className="text-xs text-gray-400 font-medium">By {template.user.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Projects */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Projects</h2>
                </div>

                {isProjectLoading ? (
                    <div className="flex items-center justify-center h-64">
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
                        {projectData && [...projectData].reverse().map((item) => (
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
    );
}
