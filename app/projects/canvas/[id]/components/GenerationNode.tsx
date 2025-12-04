'use client';

import { memo, useCallback, useState, useEffect, ChangeEvent } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ImageNode } from '../types';
import { Image as ImageIcon } from 'lucide-react';

function GenerationNode({ data, id }: NodeProps<ImageNode>) {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });

  const handlePromptChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
    data.prompt = event.target.value;
  }, [data]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    let WIDTH = 256;
    let HEIGHT = 256;

    if (naturalWidth > naturalHeight) {
      const landscapeRatio = naturalWidth / naturalHeight;
      if (landscapeRatio >= 1.889) {
        //2:1
        WIDTH = 512;
      } else if (landscapeRatio >= 1.555) {
        //16:9
        WIDTH = 455;
      } else if (landscapeRatio >= 1.167) {
        //4:3
        WIDTH = 341;
      }
    }

    else if (naturalWidth < naturalHeight) {
      const portraitRatio = naturalHeight / naturalWidth;
      if (portraitRatio >= 1.889) {
        //1:2
        HEIGHT = 512;
      } else if (portraitRatio >= 1.639) {
        //9:16
        HEIGHT = 455;
      } else if (portraitRatio >= 1.417) {
        //2:3
        HEIGHT = 384;
      } else if (portraitRatio >= 1.292) {
        //3:4
        HEIGHT = 341;
      } else if (portraitRatio >= 1.125) {
        //4:5
        HEIGHT = 320;
      }
    }

    setDimensions({
      width: WIDTH,
      height: HEIGHT,
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, secondsRemaining]);

  // Sync local generating state with data prop if controlled by parent
  useEffect(() => {
    if (typeof data.isGenerating === 'boolean') {
      setIsGenerating(data.isGenerating);
    }
  }, [data.isGenerating]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setSecondsRemaining(30);

    try {
      const event = new CustomEvent('generateImage', {
        detail: { nodeId: id, prompt }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image');
      setIsGenerating(false);
    }
  }, [prompt, id]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating Header */}
      <div
        style={{
          position: 'absolute',
          top: '-24px',
          left: '0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: isGenerating ? 0.5 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <ImageIcon className="w-3 h-3 text-gray-500" />
        <span style={{
          fontSize: '11px',
          fontWeight: 500,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Image Generator
        </span>
      </div>

      {/* Main Container */}
      <div
        style={{
          padding: '0',
          border: isGenerating ? '1px solid #27272a' : '1px solid #e5e7eb',
          borderRadius: '16px',
          background: isGenerating ? '#09090b' : 'white',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'all 0.3s ease',
        }}
      >
        {isGenerating ? (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px',
            animation: 'fadeIn 0.5s ease',
          }}>
            <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 500 }}>Generating image...</span>
            {secondsRemaining > 0 && (
              <span style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{secondsRemaining}s</span>
            )}
          </div>
        ) : (
          <>
            {/* Image Display */}
            {data.image && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <img
                  src={data.image}
                  alt="Generated"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onLoad={handleImageLoad}
                />
                {/* Gradient Overlay for Text Readability */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '80px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  pointerEvents: 'none',
                }} />
              </div>
            )}

            {/* Content Area */}
            <div style={{
              padding: '16px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: data.image ? 'flex-end' : 'flex-start',
              zIndex: 1,
              position: 'relative',
              height: '100%',
            }}>
              {/* Prompt Input / Overlay */}
              <div style={{ marginBottom: data.image ? '0' : '12px' }}>
                {!data.image && (
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#6b7280',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Prompt
                  </label>
                )}

                {data.image ? (
                  <p style={{
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: 500,
                    margin: 0,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}>
                    {prompt}
                  </p>
                ) : (
                  <textarea
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Describe your image..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                      resize: 'vertical',
                      background: '#f9fafb',
                      color: '#1f2937',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                )}
              </div>

              {/* Generate Button - Only show if no image */}
              {!data.image && (
                <button
                  onClick={handleGenerate}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                    transition: 'background-color 0.2s',
                    marginTop: 'auto',
                  }}
                >
                  Generate Image
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '24px',
          height: '24px',
          background: '#1f2937',
          border: '2px solid white',
          borderRadius: '50%',
          left: '-12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <ImageIcon className="w-3 h-3 text-white" />
      </Handle>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '24px',
          height: '24px',
          background: '#1f2937',
          border: '2px solid white',
          borderRadius: '50%',
          right: '-12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <ImageIcon className="w-3 h-3 text-white" />
      </Handle>
    </div>
  );
}

export default memo(GenerationNode);
