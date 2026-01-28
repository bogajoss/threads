import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  description,
  className,
}) => {
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-md max-h-[calc(100dvh-2rem)] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-zinc-900",
          className,
        )}
      >
        <DialogHeader className={cn("px-5 py-4 shrink-0 border-b border-zinc-100 dark:border-zinc-800", !title && "sr-only")}>
          <DialogTitle className="text-lg font-bold text-center">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {children}
        </div>

        {footer && (
          <DialogFooter className="px-5 py-4 shrink-0 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
export { DialogFooter };
