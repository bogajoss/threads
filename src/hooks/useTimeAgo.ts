import { useState, useEffect } from "react";
import { formatTimeAgo } from "@/lib/utils";

/**
 * A hook that returns a formatted time ago string and updates it every minute.
 */
export const useTimeAgo = (date: string | Date): string => {
    const [timeAgo, setTimeAgo] = useState<string>(() => formatTimeAgo(date));

    useEffect(() => {
        if (!date) return;

        // Schedule update to avoid synchronous setState in effect
        const timeout = setTimeout(() => {
            setTimeAgo(formatTimeAgo(date));
        }, 0);

        // Set up interval to update every 60 seconds
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
