'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 pt-12 pb-24 md:pt-24 md:pb-32 flex flex-col md:flex-row items-center gap-12">

            {/* Left Content */}
            <div className="relative flex-1 z-10 flex flex-col items-start gap-8 max-w-xl">
                <div className="space-y-2">
                    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6">
                        <circle cx="12" cy="12" r="12" fill="#18181B" />
                        <circle cx="30" cy="12" r="12" fill="#18181B" />
                        <circle cx="48" cy="12" r="12" fill="#18181B" />
                    </svg>
                    <h1 className="text-center text-5xl md:text-5xl font-normal tracking-tight text-black dark:text-white leading-[1.1]">
                        Creative spark <span className="font-serif italic font-light">to</span>
                        <br />
                        captivating content
                    </h1>
                    <p className="text-center text-lg text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
                        Unlock your storytelling superpowers with Catafract Studio, the
                        visual-first platform for AI video, audio, and image.
                    </p>

                    <div className="flex w-full max-w-md justify-center gap-2 p-1.5 rounded-xl">
                        <Button
                            className="h-12 px-8 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            asChild
                        >
                            <Link href="/login">
                                Get started
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Content - Astronaut Image */}
            <div className="relative w-full flex justify-center md:absolute md:translate-y-3/16 md:translate-x-5/16 z-10 pointer-events-none">
                <div className="relative w-[300px] h-[300px] md:w-[750px] md:h-[750px]">
                    <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                        <Image
                            src="/assets/astronaut.png"
                            alt="Astronaut holding soda"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}