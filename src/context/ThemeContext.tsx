/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  fontSize: "small" | "base" | "large";
  setFontSize: React.Dispatch<React.SetStateAction<"small" | "base" | "large">>;
  dataSaver: boolean;
  setDataSaver: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [fontSize, setFontSize] = useState<"small" | "base" | "large">(() => {
    return (
      (localStorage.getItem("font-size") as "small" | "base" | "large") ||
      "base"
    );
  });

  const [dataSaver, setDataSaver] = useState<boolean>(() => {
    return localStorage.getItem("data-saver") === "true";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("font-size", fontSize);
    const sizeMap = {
      small: "14px",
      base: "16px",
      large: "18px",
    };
    document.documentElement.style.setProperty(
      "--app-font-size",
      sizeMap[fontSize],
    );
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("data-saver", String(dataSaver));
  }, [dataSaver]);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      toggleDarkMode,
      fontSize,
      setFontSize,
      dataSaver,
      setDataSaver,
    }),
    [darkMode, fontSize, dataSaver, toggleDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
