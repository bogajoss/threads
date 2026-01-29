import React from "react"

interface PageTransitionProps {
    children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    return (
        <div className="duration-300 w-full animate-in fade-in slide-in-from-bottom-2 ease-out">
            {children}
        </div>
    )
}

export default PageTransition
