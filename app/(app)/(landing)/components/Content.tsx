'use client';

import Image from "next/image";

export function Content() {
    return (
        <section className="relative w-full text-black z-30">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <h2 className="text-5xl md:text-6xl font-normal tracking-tight mb-16 md:mb-24">
                    How it <span className="font-serif italic font-light">works</span>
                </h2>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
                    {/* Left: Steps */}
                    <div className="flex-1 flex flex-col gap-8 md:gap-12 mt-8">
                        <div className="relative pl-6 border-l-2 border-black/10">
                            {/* Interactive-looking dot */}
                            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-black" />

                            <h3 className="text-3xl font-medium mb-2">Inspire</h3>
                            <p className="text-zinc-600 text-lg leading-relaxed max-w-sm">
                                Accelerate your creative process with templates and AI-assisted ideation.
                            </p>
                        </div>

                        <div className="relative pl-6 border-l-2 border-transparent opacity-40">
                            <h3 className="text-3xl font-medium mb-2">Create</h3>
                        </div>

                        <div className="relative pl-6 border-l-2 border-transparent opacity-40">
                            <h3 className="text-3xl font-medium mb-2">Refine</h3>
                        </div>
                    </div>

                    {/* Right: Images/Visuals */}
                    <div className="flex-1 relative min-h-[400px]">
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Placeholder for the 3 visual cards */}
                            <div className="relative w-full aspect-square md:aspect-video flex gap-4 overflow-hidden">
                                <div className="flex-1 bg-zinc-100 rounded-xl overflow-hidden relative transform -rotate-6 translate-y-8 z-0">
                                    <Image src="/assets/outlaw.png" alt="Example 1" fill className="object-cover opacity-80" />
                                </div>
                                <div className="flex-[1.2] bg-zinc-200 rounded-xl overflow-hidden relative z-10 shadow-2xl">
                                    <Image src="/assets/astronaut.png" alt="Example 2" fill className="object-cover" />
                                </div>
                                <div className="flex-1 bg-zinc-100 rounded-xl overflow-hidden relative transform rotate-6 translate-y-8 z-0">
                                    <Image src="/assets/outlaw.png" alt="Example 3" fill className="object-cover opacity-80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
