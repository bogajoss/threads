import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import { cn } from "@/lib/utils";
import { motionTokens } from "@/config/motion";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    overlayClassName?: string;
  }
>(({ className, overlayClassName, ...props }, ref) => {
  const overlayStyle = overlayClassName?.includes('z-[9999]') 
    ? { zIndex: 9999 } 
    : undefined;
    
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      style={overlayStyle}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200",
        overlayClassName,
      )}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.(e);
      }}
      {...props}
    />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onDragClose?: () => void;
    showCloseButton?: boolean;
    overlayClassName?: string;
  }
>(
  (
    { className, children, onDragClose, showCloseButton = true, overlayClassName, ...props },
    ref,
  ) => {
    // ... (keep existing hook logic: isDesktop, controls, y, opacity, handleDragEnd) ...
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const controls = useAnimation();
    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, 200], [1, 0.5], { clamp: true });

    React.useEffect(() => {
      if (!isDesktop) {
        // Reset state on mount
        y.stop();
        y.set(100);

        controls.start({
          y: 0,
          transition: motionTokens.transition.sheetSpring
        });
      }
    }, [controls, isDesktop, y]);

    const handleDragEnd = async (_: any, info: any) => {
      if (isDesktop) return;
      if (info.offset.y > 100 || info.velocity.y > 300) {
        if (onDragClose) {
          onDragClose();
        } else {
          const closeBtn = document.querySelector(
            "[data-dialog-close]",
          ) as HTMLButtonElement;
          closeBtn?.click();
        }
      } else {
        controls.start({
          y: 0,
          transition: motionTokens.transition.sheetSpring,
        });
      }
    };

    return (
      <DialogPortal>
        <DialogOverlay overlayClassName={overlayClassName} />
        <DialogPrimitive.Content
          ref={ref}
          asChild
          aria-describedby={undefined}
          {...props}
        >
          <motion.div
            drag={isDesktop ? false : "y"}
            dragConstraints={{ top: 0, bottom: 1000 }}
            dragElastic={{ top: 0.1, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            animate={isDesktop ? undefined : controls}
            style={isDesktop ? undefined : { y, opacity, zIndex: overlayClassName?.includes('z-[9999]') ? 9999 : undefined }}
            className={cn(
              "fixed z-50 grid w-full gap-4 bg-white p-6 shadow-lg rounded-3xl dark:bg-zinc-950 sm:left-[50%] sm:top-[50%] sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%] max-sm:bottom-0 max-sm:left-0 max-sm:rounded-b-none max-sm:max-w-none",
              className,
            )}
          >
            <div className="flex w-full items-center justify-center pt-2 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
              <div className="h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <DialogPrimitive.Title className="sr-only">
              Dialog
            </DialogPrimitive.Title>

            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-dialog-close
                className="absolute right-4 top-4 rounded-full p-3 opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
