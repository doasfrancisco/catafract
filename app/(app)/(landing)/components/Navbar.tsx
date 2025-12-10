'use client';

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/app/components/button";

import { signIn } from 'next-auth/react';

export function Navbar() {
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
                <Image
                    src="/assets/logo_transparent.svg"
                    alt="Logo" width={32} height={32}
                    className=""
                />
                <span className="text-xl font-medium tracking-tight text-black dark:text-white">
                    Catafract
                </span>
            </div>

            {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                    Enterprise
                </Link>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                    Pricing
                </Link>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                    Company
                </Link>
            </div> */}

            {/* <div className="flex items-center gap-4">
                <Link
                    href="/login"
                    className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors"
                >
                    Log in
                </Link>
                <Button
                    asChild
                    className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg px-6"
                >
                    <Link href="/login">
                        Sign Up
                    </Link>
                </Button>
            </div> */}
        </nav>
    );
}
