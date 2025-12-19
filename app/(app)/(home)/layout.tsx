'use client';

import { redirect, usePathname } from "next/navigation";
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { analytics } from '@/lib/mixpanel';
import { useUserStore } from '@/app/store/useUserStore';
import Paywall from './projects/components/Paywall';
import { User, LogOut } from "lucide-react";
import { LuWorkflow } from "react-icons/lu";
import { FaTiktok } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const TIKTOK_ALLOWED_USERS = [
    '8a017b14-f44f-4d08-9be7-6841036bdb05',
    'e4e7ad8a-f0be-43c3-b324-57790e1da323',
    '0df853b7-2b89-47cf-bb9f-0632f1286353'
];

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { userData, isUserLoading } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();

    const [showUserMenu, setShowUserMenu] = useState(false);

    const handlePortal = () => {
        if (userData?.isPro) {
            window.location.href = '/api/portal';
        }
    };

    const handleSignOut = () => {
        analytics.trackSignOut();
        signOut();
    };

    if (status === 'loading' || isUserLoading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-black font-sans">
            {!userData?.isPro && (
                <Paywall />
            )}

            {/* Top Navigation Bar */}
            <div className="relative flex items-center justify-between px-6 py-4">
                {/* Left Side */}
                <div className="w-1/3"></div>

                {/* Center Icons */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 bg-[#efefeb] p-2 rounded-lg">
                    <button
                        onClick={() => router.push('/projects')}
                        className={`p-2 rounded-md transition-colors ${pathname.startsWith('/projects') ? 'bg-white' : 'hover:bg-white'}`}
                    >
                        <LuWorkflow className="w-5 h-5 text-gray-600" />
                    </button>
                    {userData?.id && TIKTOK_ALLOWED_USERS.includes(userData.id) && (
                        <button
                            onClick={() => router.push('/tiktok')}
                            className={`p-2 rounded-md transition-colors ${pathname.startsWith('/tiktok') ? 'bg-white' : 'hover:bg-white'}`}
                        >
                            <FaTiktok className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Right Side */}
                <div className="flex items-center justify-end gap-4 w-1/3">
                    {userData?.isPro && (
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 hover:cursor-pointer transition-colors"
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

            {children}
        </div>
    );
}
