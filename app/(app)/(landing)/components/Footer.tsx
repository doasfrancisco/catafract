'use client';

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Footer() {
    const footerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress: footerProgress } = useScroll({
        target: footerRef,
        offset: ["start end", "end start"]
    });
    const footerBgOpacity = useTransform(footerProgress, [0.05, 0.3], [0, 1]);
    return (
        <footer ref={footerRef} className="relative w-full text-white py-24 pb-12 z-40 overflow-hidden">
            <motion.div
                style={{ opacity: footerBgOpacity }}
                className="fixed inset-0 w-full h-full bg-black pointer-events-none z-0"
            />
            {/* Background Watermark */}
            <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none opacity-5">
                <h1 className="text-[20vw] font-bold tracking-tighter leading-none select-none">
                    Catafract
                </h1>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
                    {/* Brand */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-8">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" />
                            </svg>
                            <Link href="/" className="text-zinc-400 text-xl font-medium hover:text-white transition-colors">Catafract</Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="flex gap-16 lg:gap-32">
                        <div className="flex flex-col gap-4">
                            <h4 className="font-medium text-lg mb-2">Product</h4>
                            <Link href="https://docs.catafract.com" className="text-zinc-400 hover:text-white transition-colors">Docs</Link>
                            <Link href="https://github.com/doasfrancisco/catafract" className="text-zinc-400 hover:text-white transition-colors">Repo</Link>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h4 className="font-medium text-lg mb-2">Legal</h4>
                            <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/tos" className="text-zinc-400 hover:text-white transition-colors">Terms of use</Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center pt-8 border-t border-zinc-900 gap-4">
                    <div className="flex gap-6 uppercase text-xs font-mono tracking-wider text-zinc-500">
                        <Link href="https://x.com/doasfrancisco" className="hover:text-zinc-300">Twitter</Link>
                        <Link href="https://github.com/doasfrancisco/catafract" className="hover:text-zinc-300">Github</Link>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 text-xs font-mono text-zinc-600">
                        <span>FRAN@CATAFRACT.COM</span>
                        <span>CATAFRACT 2025 — ALL RIGHTS RESERVED</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
