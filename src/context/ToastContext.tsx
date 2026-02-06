import React, { createContext, useContext, type ReactNode } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface ToastContextType {
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
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

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};