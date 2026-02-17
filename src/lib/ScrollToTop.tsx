import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if not navigating between persistent tabs
    const persistentRoutes = ["/", "/feed", "/explore", "/notifications", "/r", "/m"];
    const isPersistent = persistentRoutes.includes(pathname) || 
                         pathname.startsWith("/r/") || 
                         pathname.startsWith("/m/") ||
                         pathname.startsWith("/explore/");
    
    // Actually, we want to SCROLL TO TOP only when moving to NEW page, like a detail page.
    // But if we move between tabs, we want to maintain scroll (handled by PersistentLayout).
    // If we move from Detail -> Tab, we want to restore Tab scroll (handled by PersistentLayout).

    // So for now, let's keep it simple: disable ScrollToTop for persistent routes
    // and let PersistentLayout handle them.
    
    if (!isPersistent) {
       window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};
