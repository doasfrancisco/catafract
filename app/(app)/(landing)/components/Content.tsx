'use client';

import Image from "next/image";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export function Content() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const features = [
        {
            title: "Social Media Management",
            description: "Create, manage, and post on TikTok using AI friendly APIs."
        },
        {
            title: "Reporting",
            description: "Real time insights and precise step-by-step actions for AI."
        },
        {
            title: "Creative Management",
            description: "Organized and optimized creative assets for AI-driven performance."
        },
        {
            title: "Audience Management",
            description: "APIs made to target precise audience segments and maximize campaign reach and standard."
        },
        {
            title: "Catalog Management",
            description: "Sync and manage product catalogs seamlessly for dynamic ad creation."
        },
        {
            title: "Business Center & Account Management",
            description: "Centralize ad operations with secure, scalable account management tools."
        },
        {
            title: "Automated Optimization",
            description: "Leverage AI to automatically adjust bids and budgets for peak performance."
        }
    ];

    // Scroll Translation Logic
    // Shifts the list Y position from 0% (start) to -80% (end) based on scroll progress.
    // This moves the "active" item into the viewing area (approx vertically centered).
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

    return (
        <section ref={containerRef} className="relative w-full h-[300vh]">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
                <div className="max-w-7xl w-full mx-auto px-6 lg:px-8">
                    <h2 className="text-5xl lg:text-6xl font-normal tracking-tight mb-8">
                        How it <span className="font-serif italic font-light">works</span>
                    </h2>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center h-[60vh] relative">
                        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full z-20 pointer-events-none" />
                        <div className="flex-1 w-full h-full relative">
                            <motion.div
                                style={{ y }}
                                className="absolute w-full top-[20%] flex flex-col gap-12"
                            >
                                {features.map((feature, index) => {
                                    const step = 1 / features.length;
                                    const start = step * index;
                                    const end = start + step;
                                    const opacity = useTransform(
                                        scrollYProgress,
                                        [start - 0.10, start, end - 0.1, end],
                                        [0, 1, 1, 0]
                                    );

                                    return (
                                        <FeatureItem
                                            key={feature.title}
                                            feature={feature}
                                            style={{ opacity }}
                                        />
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* Right: Images*/}
                        <div className="hidden lg:flex flex-1 relative w-1/2 h-full aspect-square lg:aspect-video gap-4 overflow-visible items-center z-10">
                            <div className="flex-1 rounded-xl overflow-hidden relative -rotate-6 translate-y-8 z-0 aspect-3/4">
                                <Image src="/assets/banana.jpg" alt="Example 1" fill className="object-cover opacity-80" />
                            </div>
                            <div className="flex-[1.2] rounded-xl relative z-10 aspect-4/5">
                                <Image src="/assets/watermelon.jpg" alt="Example 2" fill className="object-cover opacity-80" />
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden relative transform rotate-6 translate-y-8 z-0 aspect-3/4">
                                <Image src="/assets/apple.jpeg" alt="Example 3" fill className="object-cover opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ feature, style }: { feature: { title: string, description: string }, style: any }) {
    return (
        <motion.div
            style={style}
            className="w-full"
        >
            <div className="relative pl-6 border-l-2 border-black/10">
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-black" />
                <h3 className="text-3xl font-medium mb-3 text-black">
                    {feature.title}
                </h3>
                <p className="text-xl text-zinc-600 leading-relaxed max-w-sm">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}
