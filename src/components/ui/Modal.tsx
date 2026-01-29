import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    footer?: React.ReactNode
    description?: string
    className?: string
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    description,
    className,
}) => {
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                onDragClose={onClose}
                className={cn(
                    "flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden bg-white p-0 sm:max-w-md dark:bg-zinc-900",
                    className
                )}
            >
                <DialogHeader
                    className={cn(
                        "shrink-0 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800",
                        !title && "sr-only"
                    )}
                >
                    <DialogTitle className="text-center text-lg font-bold">
                        {title}
                    </DialogTitle>
                    {description && (
                        <DialogDescription className="text-center">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {children}
                </div>

                {footer && (
                    <DialogFooter className="shrink-0 border-t border-zinc-100 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
                        {footer}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default Modal
export { DialogFooter }
