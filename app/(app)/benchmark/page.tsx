'use client';

import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-press-start-2p",
});

export default function BenchmarkPage() {
    return (
        <div className={`min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 ${pressStart2P.className}`}>
            {/* 3D Grid Background */}
            <div className="bg-grid">
                <div className="bg-grid-lines" />
                <div
                    className="absolute inset-x-0 top-0 h-1/2"
                    style={{
                        zIndex: 1,
                        background: 'linear-gradient(to bottom, #0a0a0a 0%, #0a0a0a 40%, rgba(10, 10, 10, 0) 100%)',
                        transform: 'translateZ(1px)', // Force new layer on top of 3D context
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full flex justify-center -translate-y-1/4">
                <div className="relative max-w-4xl w-full bg-[#f5bd2c] border-3 border-[#f5bd2c] ring-2 ring-[#52350d] ring-inset p-1.5 rounded-lg">
                    <div className="py-4 text-center">
                        <h1 className="text-[#52350d] text-sm lg:text-3xl font-extrabold tracking-tighter">
                            ZERO-FOUNDER BENCHMARK
                        </h1>
                    </div>

                    <div className="bg-[#4d2f0b] mx-1 mb-1 p-8 relative rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border-3 border-[#f5bd2c] ring-2 ring-[#4d2f0b]">
                        <div className="grid grid-cols-2 gap-8 relative min-h-[300px]">
                            <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 flex flex-col items-center justify-center">
                                <div className="w-1 bg-[#f5d340] grow shadow-[1px_1px_0px_#000]"></div>
                            </div>

                            <div className="flex flex-col items-center text-left space-y-12">
                                <h2 className="text-[#f5d340] text-sm lg:text-2xl tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                                    HUMANS
                                </h2>

                                <div className="space-y-4 tracking-wide">
                                    <div>
                                        <p className="text-xs lg:text-base text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">You</p>
                                    </div>
                                    {/* <div>
                                        <p className="text-lg lg:text-base text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">O&apos;BRIEN (Staccats)</p>
                                    </div>

                                    <div>
                                        <p className="text-lg lg:text-base text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">AGREE &amp; HARRISON (Flowglad)</p>
                                    </div> */}
                                </div>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-12">
                                <h2 className="text-[#f5d340] text-sm lg:text-2xl tracking-wider drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                                    AI
                                </h2>

                                <div className="space-y-8 tracking-wide">
                                    <div>
                                        <p className="text-xs lg:text-base text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">Grok</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
