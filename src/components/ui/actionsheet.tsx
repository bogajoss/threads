import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
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
        overlayClassName="z-[9999] bg-black/45 dark:bg-black/70"
        className="w-full sm:max-w-md max-sm:max-w-md max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:rounded-[32px] max-sm:bottom-0 max-sm:max-h-none max-sm:bg-transparent max-sm:shadow-none max-sm:border-none max-sm:p-0 max-sm:gap-0 sm:top-auto sm:bottom-4 sm:translate-x-[-50%] sm:translate-y-0 sm:bg-transparent sm:shadow-none sm:border-none sm:p-0 sm:gap-0"
        style={{ zIndex: 9999 }}
      >
        {!title && (
          <DialogPrimitive.Title className="sr-only">
            Menu
          </DialogPrimitive.Title>
        )}
        <div className="w-full px-4 pt-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/75 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/75">

            {(title || description) && (
              <div className="relative z-10 flex min-h-14 w-full items-center justify-center border-b border-black/10 px-4 text-sm text-black/55 dark:border-white/10 dark:text-white/55">
                <div className="text-center leading-tight">
                  {title && <div>{title}</div>}
                  {description && (
                    <div className="mt-0.5 text-xs text-black/45 dark:text-white/45">
                      {description}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col">{children}</div>
          </div>
        </div>
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
        "relative flex h-14 w-full select-none items-center justify-center overflow-hidden border-b border-black/10 px-4 text-[19px] transition-colors active:bg-black/10 last:border-b-0 dark:border-white/10 dark:active:bg-white/10",
        variant === "destructive"
          ? "font-semibold text-rose-500"
          : "text-[--primary] font-medium",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="pointer-events-none absolute left-4 flex shrink-0 text-[--foreground]/70 dark:text-white/70">
          {icon}
        </span>
      )}
      <span className="line-clamp-1 px-8 text-center">{children}</span>
    </button>
  );
});
ActionsheetItem.displayName = "ActionsheetItem";

export { Actionsheet, ActionsheetItem };
