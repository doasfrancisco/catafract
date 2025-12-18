import { useState } from "react";

const TemplateModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (name: string) => void }) => {
    const [name, setName] = useState("");
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
                <h3 className="text-lg mb-4">Publish as Template</h3>
                <input
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Template Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                    <button onClick={() => onSave(name)} className="px-4 py-2 bg-black text-white rounded-lg">Save</button>
                </div>
            </div>
        </div>
    );
};

export default TemplateModal;