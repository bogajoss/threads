import React from "react";
import { motion, useIsPresent } from "framer-motion";
import { useMediaQuery } from "@/hooks";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={isMobile ? mobileVariants : desktopVariants}
      transition={
        isMobile
          ? {
              type: "spring",
              stiffness: 300,
              damping: 32,
              mass: 0.8,
            }
          : {
              type: "tween",
              ease: "easeInOut",
              duration: 0.2,
            }
      }
      className="w-full h-full"
      style={{
        position: isMobile && !isPresent ? "absolute" : "relative",
        top: 0,
        left: 0,
        background: "var(--background)",
        boxShadow: isMobile && isPresent ? "-10px 0 20px rgba(0,0,0,0.1)" : "none",
        willChange: "transform",
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
