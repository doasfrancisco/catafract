'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/ui/button";

export function Hero() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-0 lg:px-6 pt-0 pb-12 lg:pt-24 lg:pb-32 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left Content */}
            <div className="relative flex-1 z-10 flex flex-col items-center lg:items-start gap-6 lg:gap-8 max-w-xl px-6 lg:px-0">
                <div className="space-y-4 lg:space-y-2">
                    {/* Three Dots - Mobile Only */}
                    <div className="flex lg:hidden justify-center mb-6">
                        <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="12" fill="#18181B" />
                            <circle cx="30" cy="12" r="12" fill="#18181B" />
                            <circle cx="48" cy="12" r="12" fill="#18181B" />
                        </svg>
                    </div>

                    {/* Three Dots - Desktop Only */}
                    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block mx-auto">
                        <circle cx="12" cy="12" r="12" fill="#18181B" />
                        <circle cx="30" cy="12" r="12" fill="#18181B" />
                        <circle cx="48" cy="12" r="12" fill="#18181B" />
                    </svg>

                    <h1 className="text-center lg:text-center text-4xl lg:text-5xl font-normal tracking-tight text-black dark:text-white leading-[1.1]">
                        Creative spark <span className="font-serif italic font-light">to</span>
                        <br />
                        captivating content
                    </h1>
                    <p className="text-center lg:text-center lg:text-lg text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed mx-auto lg:mx-0">
                        Unlock your storytelling superpowers with Catafract Studio, the
                        visual-first platform for AI video, audio, and image.
                    </p>

                    {/* Desktop Button */}
                    <div className="hidden lg:flex w-full max-w-md justify-center gap-2 p-1.5 rounded-xl">
                        <Button
                            className="h-12 px-8 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            asChild
                        >
                            {/* <Link href="https://calendly.com/doasfrancisco/15min"> */}
                            <Link href="/login">
                                {/* Schedule a call */}
                                Get started
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Input + Button */}
                    <div className="flex lg:hidden w-full flex-col items-center gap-3 pt-4">
                        <Button
                            className="h-12 w-1/2 px-8 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
            {/* Mobile: Relative, full width, curved bottom */}
            {/* Desktop: Absolute, positioned */}
            <div className="relative w-full flex justify-center lg:absolute z-10 lg:translate-y-3/16 lg:translate-x-5/16 pointer-events-none">

                {/* Mobile Image Container */}
                <div className="lg:hidden relative w-full aspect-4/3 max-h-[60vh] overflow-hidden [clip-path:ellipse(130%_90%_at_50%_10%)]">
                    <Image
                        src="/assets/astronaut.png"
                        alt="Astronaut holding soda"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>

                {/* Desktop Image Container - Unchanged */}
                {/* <div className="hidden lg:block relative w-[750px] h-[750px]">
                    <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                        <Image
                            src="/assets/astronaut.png"
                            alt="Astronaut holding soda"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div > */}

                <div className="hidden lg:block relative">
                    <div className="relative w-[750px] h-[750px]">
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
            </div >
        </section >
    );
}