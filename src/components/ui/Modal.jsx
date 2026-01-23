import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

const Modal = ({ isOpen, onClose, title, children, footer, description, className }) => {
    const handleOpenChange = (open) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className={cn("sm:max-w-md max-h-[calc(100dvh-2rem)] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800", className)}>
                {title && (
                    <DialogHeader className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}
                
                <div className="flex-1 overflow-y-auto p-5 min-h-0">
                    {children}
                </div>

                {footer && (
                    <DialogFooter className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
export { DialogFooter };