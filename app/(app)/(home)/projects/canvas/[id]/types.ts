import { Node } from '@xyflow/react';

export interface ImageNodeData extends Record<string, unknown> {
  type: 'upload' | 'generation';
  image?: string;
  prompt?: string;
  isGenerating?: boolean;
}

export type ImageNode = Node<ImageNodeData>;
