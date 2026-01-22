import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const isValidUUID = (uuid) => {
  if (typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};