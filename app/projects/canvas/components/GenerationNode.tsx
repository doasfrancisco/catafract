'use client';

import { memo, useCallback, useState, ChangeEvent } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ImageNode } from '../types';

function GenerationNode({ data, id }: NodeProps<ImageNode>) {
  const [prompt, setPrompt] = useState(data.prompt || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePromptChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
    data.prompt = event.target.value;
  }, [data]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);

    try {
      // Dispatch event to get connected input images from parent
      const event = new CustomEvent('generateImage', {
        detail: { nodeId: id, prompt }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, id]);

  return (
    <div style={{
      padding: '10px',
      border: '2px solid #8b5cf6',
      borderRadius: '8px',
      background: 'white',
      minWidth: '250px',
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#8b5cf6',
      }}>
        Generate Image
      </div>

      <textarea
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Enter your prompt..."
        style={{
          width: '100%',
          minHeight: '60px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          fontSize: '12px',
          resize: 'vertical',
          marginBottom: '10px',
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: isGenerating ? '#9ca3af' : '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>

      {data.image && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={data.image}
            alt="Generated"
            style={{
              width: '100%',
              maxWidth: '250px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
            }}
          />
        </div>
      )}

      {/* Input handle - can accept multiple connections */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#8b5cf6',
          width: '12px',
          height: '12px',
        }}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#8b5cf6',
          width: '12px',
          height: '12px',
        }}
      />
    </div>
  );
}

export default memo(GenerationNode);
