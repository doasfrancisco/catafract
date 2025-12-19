'use client';

import { useState, useEffect } from 'react';
import { FaTiktok } from "react-icons/fa";
import { useTiktok } from './store/useTiktok';
import { useUserStore } from '@/app/store/useUserStore';

export default function TiktokPage() {
    const { promptText, isLoading, isSaving, setPromptText, fetchPromptData, savePromptData } = useTiktok();
    const { userData } = useUserStore();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');

    useEffect(() => {
        if (!userData?.id) return;
        fetchPromptData(userData?.id);
    }, []);

    const handleSave = async () => {
        setSaveStatus('idle');
        const success = await savePromptData();
        if (success) {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
            setSaveStatus('error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-10">
            <div className="flex flex-col items-center mb-16">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <FaTiktok className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold">TikTok</h1>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prompt
                    </label>
                    {isLoading ? (
                        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
                    ) : (
                        <textarea
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder="Enter your prompt..."
                        />
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    {saveStatus === 'saved' && (
                        <span className="text-green-600 text-sm">Saved!</span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-600 text-sm">Error saving</span>
                    )}
                </div>
            </div>
        </div>
    );
}
