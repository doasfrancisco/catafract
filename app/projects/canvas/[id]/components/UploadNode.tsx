'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ImageNode } from '../types';
import { Image as ImageIcon } from 'lucide-react';

function UploadNode({ data, id }: NodeProps<ImageNode>) {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Azure via API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();

      // Emit event to update parent state with Azure URL
      const event = new CustomEvent('nodeDataUpdate', {
        detail: {
          nodeId: id,
          data: { image: url },
        },
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

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
          Creation
        </span>
      </div>

      {/* Main Container */}
      <div
        style={{
          padding: '0',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          background: 'white',
          minWidth: '200px',
          minHeight: '200px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!data.image && (
          <div style={{
            width: '100%',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            cursor: 'pointer',
            position: 'relative',
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
              }}
            />
            <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              Click to upload
            </span>
          </div>
        )}

        {data.image && (
          <img
            src={data.image}
            alt="Uploaded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}
      </div>

      {/* Custom Handle */}
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

export default memo(UploadNode);
