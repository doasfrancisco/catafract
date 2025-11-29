'use client';

import { useUserStore } from '@/lib/stores/useUserStore';
import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react";

function UserProvider() {
    const { userData, fetchUserData } = useUserStore();

    useEffect(() => {
        if (!userData) {
            fetchUserData();
        }
    }, [fetchUserData, userData]);

    return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UserProvider />
            {children}
        </SessionProvider>
    );
}
