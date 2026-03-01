import React from "react";
import { motion, useIsPresent } from "motion/react";
import { useMediaQuery } from "@/hooks";
import { motionTokens } from "@/config/motion";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  mode?: "default" | "none";
  className?: string;
  style?: React.CSSProperties;
  noBackground?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  mode = "default", 
  className, 
  style,
  noBackground = false
}) => {
  const isPresent = useIsPresent();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // iOS-style slide transition for mobile
  const mobileVariants = {
    initial: { x: "100%", zIndex: 10 },
    animate: { x: 0, zIndex: 10 },
    exit: { x: "-30%", opacity: 0.9, zIndex: 0 },
  };

  // Modern fade-up for desktop
  const desktopVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const noAnimationVariants = {
    initial: { opacity: 1, x: 0, y: 0 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 1, x: 0, y: 0 },
  };

  const variants = mode === "none"
    ? noAnimationVariants
    : isMobile
      ? mobileVariants
      : desktopVariants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={
        isMobile
          ? motionTokens.transition.sheetSpring
          : {
            type: "tween",
            ease: "easeInOut",
            duration: 0.2,
          }
      }
      className={cn("w-full h-full", className)}
      style={{
        position: isMobile && !isPresent ? "absolute" : "relative",
        top: 0,
        left: 0,
        background: noBackground ? "transparent" : "var(--background)",
        boxShadow: isMobile && isPresent ? "-10px 0 20px rgba(0,0,0,0.1)" : "none",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Dimming overlay for exiting page */}
      {isMobile && !isPresent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute inset-0 bg-black pointer-events-none z-[11]"
        />
      )}
      {children}
    </motion.div>
  );
};

export default PageTransition;
