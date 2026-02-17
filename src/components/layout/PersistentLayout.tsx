import React, { lazy, Suspense, useRef, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "./PageTransition";

// Lazy load the pages
const Feed = lazy(() => import("@/pages/(feed)/Feed"));
const Explore = lazy(() => import("@/pages/(feed)/Explore"));
const Reels = lazy(() => import("@/pages/(feed)/Reels"));
const Messages = lazy(() => import("@/pages/(feed)/Messages"));
const Notifications = lazy(() => import("@/pages/(feed)/Notifications"));

interface PersistentLayoutProps {
  onStoryClick?: (story: any) => void;
}

const PersistentLayout: React.FC<PersistentLayoutProps> = ({ onStoryClick }) => {
  const location = useLocation();
  const path = location.pathname;
  const scrollPositions = useRef<Record<string, number>>({});
  
  // Track the *previous* path to know what to save
  const prevPathRef = useRef(path);
  const currentScrollY = useRef(0);

  // Active state logic
  const isFeedActive = path === "/feed" || path === "/";
  const isExploreActive = path === "/explore" || (path.startsWith("/explore/") && path.split("/").length === 3 && !path.includes("/tags/")); 
  const isReelsActive = path === "/r" || path === "/r/"; 
  const isMessagesActive = path === "/m" || path === "/m/";
  const isNotificationsActive = path === "/notifications";

  // Continuous scroll tracker
  useEffect(() => {
    const handleScroll = () => {
        currentScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update prev path and save scroll position in an Effect, not render
  useLayoutEffect(() => {
      // If path has changed
      if (prevPathRef.current !== path) {
          const prev = prevPathRef.current;
          const wasFeed = prev === "/feed" || prev === "/";
          const wasExplore = prev === "/explore" || (prev.startsWith("/explore/") && prev.split("/").length === 3);
          const wasReels = prev === "/r" || prev === "/r/"; 
          const wasMessages = prev === "/m" || prev === "/m/";
          const wasNotifications = prev === "/notifications";

          const lastScrollY = currentScrollY.current;

          // Save the last known scroll position to the outgoing tab
          if (wasFeed) scrollPositions.current["feed"] = lastScrollY;
          else if (wasExplore) scrollPositions.current["explore"] = lastScrollY;
          else if (wasReels) scrollPositions.current["reels"] = lastScrollY;
          else if (wasMessages) scrollPositions.current["messages"] = lastScrollY;
          else if (wasNotifications) scrollPositions.current["notifications"] = lastScrollY;
          
          prevPathRef.current = path;

          // Restore scroll for the NEW path immediately
          const getPos = (key: string) => scrollPositions.current[key] || 0;
          let newPos = 0;
          
          // Determine new active 
          const newIsFeed = path === "/feed" || path === "/";
          const newIsExplore = path === "/explore" || (path.startsWith("/explore/") && path.split("/").length === 3 && !path.includes("/tags/")); 
          const newIsReels = path === "/r" || path === "/r/"; 
          const newIsMessages = path === "/m" || path === "/m/";
          const newIsNotifications = path === "/notifications";

          if (newIsFeed) newPos = getPos("feed");
          else if (newIsExplore) newPos = getPos("explore");
          else if (newIsReels) newPos = getPos("reels");
          else if (newIsMessages) newPos = getPos("messages");
          else if (newIsNotifications) newPos = getPos("notifications");

          window.scrollTo(0, newPos);
          currentScrollY.current = newPos;
      }
  }, [path]); 


  return (
    <div className="relative w-full">
      {/* FEED */}
      <div className={isFeedActive ? "block min-h-screen" : "hidden"}>
        <KeepAlive isActive={isFeedActive}>
            <PageTransition>
              <Feed onStoryClick={onStoryClick} />
            </PageTransition>
        </KeepAlive>
      </div>

      {/* EXPLORE */}
      <div className={isExploreActive ? "block min-h-screen" : "hidden"}>
        <KeepAlive isActive={isExploreActive}>
            <PageTransition>
              <Explore />
            </PageTransition>
        </KeepAlive>
      </div>

      {/* REELS */}
      <div className={isReelsActive ? "block min-h-screen" : "hidden bg-black"}>
        <KeepAlive isActive={isReelsActive}>
             <PageTransition>
              <Reels />
             </PageTransition>
        </KeepAlive>
      </div>

      {/* MESSAGES */}
      <div className={isMessagesActive ? "block min-h-screen" : "hidden"}>
        <KeepAlive isActive={isMessagesActive}>
            <PageTransition>
              <Messages />
            </PageTransition>
        </KeepAlive>
      </div>

      {/* NOTIFICATIONS */}
      <div className={isNotificationsActive ? "block min-h-screen" : "hidden"}>
        <KeepAlive isActive={isNotificationsActive}>
            <PageTransition>
              <Notifications />
            </PageTransition>
        </KeepAlive>
      </div>
    </div>
  );
};

function KeepAlive({ isActive, children }: { isActive: boolean; children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(isActive);

  // If component becomes active but state is false, update it during render
  // This is safe because it only happens when props change (isActive becomes true)
  // and terminates immediately.
  if (isActive && !shouldRender) {
    setShouldRender(true);
  }

  // If it's not active and never was active (shouldRender is false), return null.
  if (!shouldRender) return null;

  return (
    <Suspense fallback={<div className="h-screen w-full bg-black" />}>
       {children}
    </Suspense>
  );
}

export default PersistentLayout;
