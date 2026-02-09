import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out fill-mode-forwards">
      {children}
    </div>
  );
};

export default PageTransition;
