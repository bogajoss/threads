import React, { lazy, useRef, useEffect, useLayoutEffect, useState } from "react";
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

  // Page state - track which pages have been visited to keep them alive
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());

  // Active state logic
  const isFeedActive = path === "/feed" || path === "/";
  const isExploreActive = path === "/explore" || (path.startsWith("/explore/") && path.split("/").length === 3 && !path.includes("/tags/"));
  const isReelsActive = path === "/r" || path === "/r/";
  const isMessagesActive = path === "/m" || path === "/m/";
  const isNotificationsActive = path === "/notifications";

  // Track which pages have been visited to preserve them
  useEffect(() => {
    if (isFeedActive) setVisitedPages(prev => new Set(prev).add("feed"));
    else if (isExploreActive) setVisitedPages(prev => new Set(prev).add("explore"));
    else if (isReelsActive) setVisitedPages(prev => new Set(prev).add("reels"));
    else if (isMessagesActive) setVisitedPages(prev => new Set(prev).add("messages"));
    else if (isNotificationsActive) setVisitedPages(prev => new Set(prev).add("notifications"));
  }, [isFeedActive, isExploreActive, isReelsActive, isMessagesActive, isNotificationsActive]);

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

      // Restore scroll for the NEW path with a small delay to ensure DOM is ready
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

      // Use requestAnimationFrame to ensure scroll happens after render
      requestAnimationFrame(() => {
        window.scrollTo(0, newPos);
        currentScrollY.current = newPos;
      });
    }
  }, [path]);


  return (
    <div className="relative w-full">
      {/* FEED */}
      {visitedPages.has("feed") && (
        <div className={isFeedActive ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Feed onStoryClick={onStoryClick} />
          </PageTransition>
        </div>
      )}

      {/* EXPLORE */}
      {visitedPages.has("explore") && (
        <div className={isExploreActive ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Explore />
          </PageTransition>
        </div>
      )}

      {/* REELS */}
      {visitedPages.has("reels") && (
        <div className={isReelsActive ? "block min-h-[100dvh]" : "hidden bg-black"}>
          <PageTransition mode="none">
            <Reels />
          </PageTransition>
        </div>
      )}

      {/* MESSAGES */}
      {visitedPages.has("messages") && (
        <div className={isMessagesActive ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Messages />
          </PageTransition>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {visitedPages.has("notifications") && (
        <div className={isNotificationsActive ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Notifications />
          </PageTransition>
        </div>
      )}
    </div>
  );
}

export default PersistentLayout;
