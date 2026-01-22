import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { uploadFile, addStory } from '@/services/api';

const CreateStoryModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth();
    const { addToast } = useToast();
    const queryClient = useQueryClient();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleCreateStory = async () => {
        if (!selectedFile || !currentUser) return;

        setLoading(true);
        try {
            const uploadedMedia = await uploadFile(selectedFile);
            await addStory(currentUser.id, uploadedMedia.url, uploadedMedia.type);
            
            setSelectedFile(null);
            onClose();
            addToast("Story shared!");
            queryClient.invalidateQueries(['stories']);
        } catch (err) {
            console.error('Failed to create story:', err);
            addToast("Failed to share story.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={() => !loading && onClose()} title="Add Story">
            <div className="space-y-6">
                {!selectedFile ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-[9/16] w-full max-w-[280px] mx-auto border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                        <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full text-violet-600">
                            <ImageIcon size={32} />
                        </div>
                        <div className="text-center">
                            <p className="font-bold dark:text-white">Choose a photo</p>
                            <p className="text-sm text-zinc-500">Stories last for 24 hours</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative aspect-[9/16] w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden shadow-2xl border dark:border-zinc-800">
                        <img 
                            src={URL.createObjectURL(selectedFile)} 
                            className="w-full h-full object-cover" 
                            alt="Preview" 
                        />
                        <button 
                            onClick={() => setSelectedFile(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept="image/*" 
                />

                <Button 
                    className="w-full py-3 text-lg" 
                    disabled={!selectedFile || loading} 
                    onClick={handleCreateStory}
                >
                    {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : "Share story"}
                </Button>
            </div>
        </Modal>
    );
};

export default CreateStoryModal;
