import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

const Modal = ({ isOpen, onClose, title, children, description }) => {
    const handleOpenChange = (open) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                {title && (
                    <DialogHeader className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}
                <div className="p-5 overflow-y-auto">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
