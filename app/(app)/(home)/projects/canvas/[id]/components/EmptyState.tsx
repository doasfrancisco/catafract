import { Image as ImageIcon, Sparkles } from "lucide-react";

interface EmptyStateProps {
    onUpload: () => void;
    onAddGeneration: () => void;
}

export default function EmptyState({ onUpload, onAddGeneration }: EmptyStateProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <div className="flex flex-col items-center pointer-events-auto">
                {/* <h2 className="text-2xl font-medium text-gray-900 mb-2">Your space is ready</h2>
                <p className="text-gray-500 mb-8">Choose your first node and start creating</p> */}

                <div className="flex gap-6">
                    <button
                        onClick={onUpload}
                        className="w-40 aspect-square bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all group hover:cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-center">
                            Upload <br /> image
                        </span>
                    </button>

                    <button
                        onClick={onAddGeneration}
                        className="w-40 aspect-square bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all group hover:cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-center">
                            Image <br /> Generator
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}