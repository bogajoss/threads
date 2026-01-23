/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  /**
   * Adds a toast message using Sonner.
   * @param {string} message - The message to display.
   * @param {string} type - 'success' | 'error' | 'info'
   */
  const addToast = (message, type = "success") => {
    if (type === "error") {
      toast.error(message);
    } else if (type === "info") {
      toast.info(message);
    } else {
      toast.success(message);
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "rounded-full font-bold",
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
