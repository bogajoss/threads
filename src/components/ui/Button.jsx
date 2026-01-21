import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "rounded-full font-bold inline-flex items-center justify-center relative overflow-hidden px-4 py-1.5 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 touch-manipulation";
    const variants = {
        primary: "text-white hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 dark:bg-white dark:text-black dark:border-white dark:hover:bg-zinc-200",
        secondary: "text-zinc-900 border border-zinc-300 hover:border-zinc-400 bg-transparent hover:bg-zinc-50 dark:text-white dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
        outline: "text-zinc-900 border border-zinc-300 hover:border-zinc-400 bg-white dark:bg-transparent dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-900",
        danger: "text-white bg-red-500 hover:bg-red-600 border border-red-500",
        ghost: "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 border-transparent"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            <div className="flex items-center gap-x-1.5">
                {children}
            </div>
        </button>
    );
};

export default Button;
