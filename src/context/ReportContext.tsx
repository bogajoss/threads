import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { ReportTargetType } from "@/lib/api/reports";

interface ReportContextType {
  isOpen: boolean;
  targetType: ReportTargetType | null;
  targetId: string | null;
  openReport: (type: ReportTargetType, id: string) => void;
  closeReport: () => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetType, setTargetType] = useState<ReportTargetType | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  const openReport = useCallback((type: ReportTargetType, id: string) => {
    setTargetType(type);
    setTargetId(id);
    setIsOpen(true);
  }, []);

  const closeReport = useCallback(() => {
    setIsOpen(false);
    setTargetType(null);
    setTargetId(null);
  }, []);

  return (
    <ReportContext.Provider value={{ isOpen, targetType, targetId, openReport, closeReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportModal = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReportModal must be used within a ReportProvider");
  return context;
};
