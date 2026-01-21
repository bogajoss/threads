import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ darkMode, setDarkMode, mobile = false }) => {
    if (mobile) {
        return (
            <a href="#" onClick={(e) => { e.preventDefault(); setDarkMode(!darkMode); }} className="p-2 text-zinc-400">
                {darkMode ? <Sun size={26} /> : <Moon size={26} />}
            </a>
        )
    }
    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 mt-2 flex items-center gap-4 group transition-colors"
        >
            {darkMode ? <Sun size={26} /> : <Moon size={26} />}
            <span className="hidden xl:block text-lg font-medium group-hover:text-black dark:group-hover:text-white">Theme</span>
        </button>
    );
};

export default ThemeToggle;
