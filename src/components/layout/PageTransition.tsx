import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-forwards">
      {children}
    </div>
  );
};

export default PageTransition;
