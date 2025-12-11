'use client';

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Mission() {
    const missionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: missionRef,
        offset: ["start end", "end start"]
    });
    const missionBgOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

    return (
        <section ref={missionRef} className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24">
            <motion.div
                style={{ opacity: missionBgOpacity }}
                className="fixed inset-0 w-full h-full bg-black pointer-events-none z-0"
            />
            {/* 3 Overlapping Circles */}
            <div className="relative flex items-center justify-center mb-16">
                {/* Left Circle */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-black z-10 -mr-12">
                    <Image
                        src="/assets/outlaw.png" // Placeholder, user can swap to specific circle images
                        alt="Circle 1"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Center Circle */}
                <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-black z-20 shadow-2xl">
                    <Image
                        src="/assets/me.jpg" // Placeholder
                        alt="Circle 2"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Right Circle */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-black z-10 -ml-12">
                    <Image
                        src="/assets/julissa.jpg" // Placeholder
                        alt="Circle 3"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Text Content */}
            <div className="max-w-4xl px-6 text-center z-10">
                <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight leading-tight selection:bg-white selection:text-black">
                    Many tools. One platform.
                    <br />
                    We provide the tools your AI needs for audience management, post creation, and reporting.
                </h2>
            </div>

        </section>
    );
}
