import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionsheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const Actionsheet: React.FC<ActionsheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onDragClose={onClose}
        showCloseButton={false}
        className="max-sm:p-0 max-sm:gap-0 max-sm:rounded-t-[32px] overflow-hidden"
      >
        {!title && (
          <DialogPrimitive.Title className="sr-only">
            Menu
          </DialogPrimitive.Title>
        )}
        {(title || description) && (
          <DialogHeader className="px-6 pt-2 pb-4 border-b border-[--border] sm:text-center">
            {title && (
              <DialogTitle className="text-[17px] font-bold">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-sm">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="flex flex-col py-2 max-sm:pb-8">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

interface ActionsheetItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
}

const ActionsheetItem = React.forwardRef<
  HTMLButtonElement,
  ActionsheetItemProps
>(({ className, variant = "default", icon, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center gap-3 px-6 py-4 text-[16px] font-semibold transition-colors active:bg-neutral-100 dark:active:bg-neutral-900",
        variant === "destructive" ? "text-rose-500" : "text-[--foreground]",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex shrink-0">{icon}</span>}
      <span className="flex-1 text-left">{children}</span>
    </button>
  );
});
ActionsheetItem.displayName = "ActionsheetItem";

export { Actionsheet, ActionsheetItem };
