'use client';

import { FaTiktok } from "react-icons/fa";

export default function TiktokPage() {
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

            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p className="text-lg">Coming soon...</p>
            </div>
        </div>
    );
}
