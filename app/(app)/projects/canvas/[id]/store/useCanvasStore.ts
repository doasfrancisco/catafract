import { create } from 'zustand';

interface CanvasData {
    id?: string;
    projectId?: string;
    nodes?: any[];
    edges?: any[];
}

interface CanvasStore {
    canvasData: CanvasData | null;
    isCanvasLoading: boolean;
    setCanvasData: (data: CanvasData | null) => void;
    setLoading: (loading: boolean) => void;
    fetchCanvasData: (projectId: string) => Promise<void>;
    resetCanvasData: () => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
    canvasData: null,
    isCanvasLoading: true,
    setCanvasData: (data) => set({ canvasData: data }),
    setLoading: (loading) => set({ isCanvasLoading: loading }),
    fetchCanvasData: async (projectId: string) => {
        set({ isCanvasLoading: true });
        try {
            const response = await fetch(`/api/user/project/canvas?projectId=${projectId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            set({ canvasData: data, isCanvasLoading: false });
        } catch (error) {
            console.error('Failed to fetch project data:', error);
            set({ isCanvasLoading: false });
        }
    },
    resetCanvasData: () => set({ canvasData: null, isCanvasLoading: true }),
}));