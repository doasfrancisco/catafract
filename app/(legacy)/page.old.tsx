'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';

import { analytics } from '@/lib/mixpanel';
import VideoPlayer from './VideoPlayer_old';

type PortfolioList = {
    playbackId: string;
    title: string;
}

export default function Home() {
    const [playbackId, setPlaybackId] = useState<string>('');

    const portfolioList: PortfolioList[] = [
        { playbackId: 'tcjPxqkq7V4RBiqze4LxxVx02agmzSmRCpa2N1iP1wH8', title: 'Kevin Gomez (GDG)' },
        { playbackId: 'Stlg6GslUE6VXRnMjuH2scvri00bWjJ800qlNogLFnUm00', title: 'Grúas Esmy' },
        { playbackId: 'nsLRWpqpdmtYipbB31SrKKbQnWnB1IGzVjnFTVphPvs', title: 'Trascendental' },
        { playbackId: 'NJKfO2Y5AcyeufR7VFpXXxMty0057xzZLO9NMbPK6c02k', title: "Wonder Kids" },
        { playbackId: 'T200mP1l00d8BMdtXXghxhdaguAsS7daPeSir02ewcpsJM', title: 'Magical Book' },
    ];

    useEffect(() => {
        analytics.ensureIdentity();
    }, []);

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <main className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-light-grey mb-1">
                        Catafract
                    </h1>
                    <p className="text-base md:text-xl text-light-grey mb-7">
                        AI agency for marketing.
                    </p>

                    <p className="text-sm md:text-xl text-grey">
                        Market your business.
                    </p>
                    <p className="text-sm md:text-xl text-grey">
                        Someone out there needs it.
                    </p>

                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/canvas' })}
                        className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Get started
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-0.5 gap-y-0.5'>
                    {portfolioList.map((video) => (
                        <div key={video.playbackId}>
                            <VideoPlayer
                                playbackId={video.playbackId}
                                title={video.title}
                            />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}