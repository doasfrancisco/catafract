'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ImageNode } from '../types';

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
    <div
      style={{
        padding: '10px',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        background: 'white',
        minWidth: '200px',
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#3b82f6',
        }}
      >
        Upload Image
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          marginBottom: '10px',
          fontSize: '12px',
        }}
      />

      {data.image && (
        <div style={{ marginTop: '10px' }}>
          <img
            src={data.image}
            alt="Uploaded"
            style={{
              width: '100%',
              maxWidth: '200px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
            }}
          />
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#3b82f6',
          width: '12px',
          height: '12px',
        }}
      />
    </div>
  );
}

export default memo(UploadNode);
