import { useState, useEffect } from "react";
import { formatTimeAgo } from "@/lib/utils";

export const useTimeAgo = (date: string | Date): string => {
  const [timeAgo, setTimeAgo] = useState<string>(() => formatTimeAgo(date));

  useEffect(() => {
    if (!date) return;

    const timeout = setTimeout(() => {
      setTimeAgo(formatTimeAgo(date));
    }, 0);

    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(date));
    }, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [date]);

  return timeAgo;
};