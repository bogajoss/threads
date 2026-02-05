import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  mobile?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode,
  setDarkMode,
  mobile = false,
}) => {
  if (mobile) {
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setDarkMode(!darkMode);
        }}
        className="text-zinc-400 p-2"
      >
        {darkMode ? <Sun size={26} /> : <Moon size={26} />}
      </a>
    );
  }
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="group mt-2 flex items-center gap-4 rounded-full p-3 text-zinc-600 transition-colors hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
    >
      {darkMode ? <Sun size={26} /> : <Moon size={26} />}
      <span className="hidden text-lg font-medium group-hover:text-black dark:group-hover:text-white xl:block">
        Theme
      </span>
    </button>
  );
};

export default ThemeToggle;
