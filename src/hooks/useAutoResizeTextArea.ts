import { useEffect, useRef } from "react";

export const useAutoResizeTextArea = (
  value: string,
  minHeight: number = 40,
  maxHeight: number = 120,
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      const scrollHeight = textArea.scrollHeight;
      textArea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
  }, [value, minHeight, maxHeight]);

  return textAreaRef;
};
