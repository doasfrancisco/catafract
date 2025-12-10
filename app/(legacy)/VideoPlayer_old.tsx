'use client';

import { useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface VideoPlayerProps {
  playbackId: string;
  title?: string;
}

export default function VideoPlayer({ playbackId, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const animatedThumbnailUrl = `https://image.mux.com/${playbackId}/animated.gif?width=640`;

  if (!isPlaying) {
    return (
      <div
        className="w-full block cursor-pointer relative"
        onClick={() => setIsPlaying(true)}
      >
        <img
          src={animatedThumbnailUrl}
          alt={title || 'Video preview'}
          className="w-full block"
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black/50 rounded-full p-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
      <MuxPlayer
        style={{
          '--seek-backward-button': 'none',
          '--seek-forward-button': 'none',
          '--rendition-menu-button': 'none',
        } as React.CSSProperties}
        streamType="on-demand"
        autoPlay
        loop
        playbackId={playbackId}
        disableTracking={true}
        className="w-full block"
      />
  );
}
