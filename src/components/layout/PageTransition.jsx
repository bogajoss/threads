import React from "react";

const PageTransition = ({ children }) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      {children}
    </div>
  );
};

export default PageTransition;
