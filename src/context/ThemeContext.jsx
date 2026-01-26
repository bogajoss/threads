/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem("font-size") || "base"; // small, base, large
  });

  const [dataSaver, setDataSaver] = useState(() => {
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
    document.documentElement.style.setProperty("--app-font-size", sizeMap[fontSize]);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("data-saver", dataSaver);
  }, [dataSaver]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleDarkMode,
        fontSize,
        setFontSize,
        dataSaver,
        setDataSaver,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
