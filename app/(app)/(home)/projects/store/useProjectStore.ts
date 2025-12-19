import { create } from 'zustand';

interface ProjectData {
    id?: string;
    userId?: string;
    name?: string;
    createdDate?: Date;
}

interface ProjectStore {
    projectData: ProjectData[] | null;
    isProjectLoading: boolean;
    setProjectData: (data: ProjectData[] | null) => void;
    setLoading: (loading: boolean) => void;
    fetchProjectData: (userId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projectData: null,
    isProjectLoading: true,
    setProjectData: (data) => set({ projectData: data }),
    setLoading: (loading) => set({ isProjectLoading: loading }),
    fetchProjectData: async (userId: string) => {
        set({ isProjectLoading: true });
        try {
            const response = await fetch(`/api/user/project?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            const projects = data.map((project: ProjectData) => ({
                ...project,
                createdDate: new Date(project.createdDate!),
            }));
            set({ projectData: projects, isProjectLoading: false });
        } catch (error) {
            console.error('Failed to fetch project data:', error);
            set({ isProjectLoading: false });
        }
    },
}));