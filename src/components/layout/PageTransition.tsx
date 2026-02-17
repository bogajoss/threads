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
    initial: { x: "100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-20%", opacity: 0.8 }, 
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
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 30,
        mass: 1
      }}
      className="w-full h-full"
      style={{
        position: isMobile && !isPresent ? "absolute" : undefined,
        top: 0,
        left: 0,
        background: "var(--background)", 
        zIndex: isPresent ? 1 : 0
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
