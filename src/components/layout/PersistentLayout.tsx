import React, { lazy, useRef, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "./PageTransition";

// Lazy load the pages
const Feed = lazy(() => import("@/pages/(feed)/Feed"));
const Explore = lazy(() => import("@/pages/(feed)/Explore"));
const Reels = lazy(() => import("@/pages/(feed)/Reels"));
const Messages = lazy(() => import("@/pages/(feed)/Messages"));
const Notifications = lazy(() => import("@/pages/(feed)/Notifications"));
const CreatePost = lazy(() => import("@/pages/(feed)/CreatePost"));
const EditProfile = lazy(() => import("@/pages/(feed)/EditProfile"));

interface PersistentLayoutProps {
  onStoryClick?: (story: any) => void;
}

type PersistentTabKey =
  | "feed"
  | "explore"
  | "reels"
  | "messages"
  | "notifications"
  | "create"
  | "editProfile";

const normalizePath = (pathname: string): string =>
  pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

const getPersistentTabKey = (pathname: string): PersistentTabKey | null => {
  const path = normalizePath(pathname);

  if (path === "/" || path === "/feed" || path === "/home") return "feed";
  if (path === "/explore") return "explore";
  if (path === "/r") return "reels";
  if (path === "/m") return "messages";
  if (path === "/notifications") return "notifications";
  if (path === "/create") return "create";
  if (path === "/edit-profile") return "editProfile";

  return null;
};

const PersistentLayout: React.FC<PersistentLayoutProps> = ({ onStoryClick }) => {
  const location = useLocation();
  const path = normalizePath(location.pathname);
  const activeTabKey = getPersistentTabKey(path);
  const scrollPositions = useRef<Record<string, number>>({});

  // Track the *previous* path to know what to save
  const prevPathRef = useRef(path);
  const currentScrollY = useRef(0);

  // Page state - track which pages have been visited to keep them alive
  const [visitedPages, setVisitedPages] = useState<Set<PersistentTabKey>>(() => {
    const initialSet = new Set<PersistentTabKey>();
    if (activeTabKey) initialSet.add(activeTabKey);
    return initialSet;
  });

  useEffect(() => {
    if (!activeTabKey) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitedPages(prev => {
      if (prev.has(activeTabKey)) return prev;

      const newSet = new Set(prev);
      newSet.add(activeTabKey);
      return newSet;
    });
  }, [activeTabKey]);

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
      const previousTabKey = getPersistentTabKey(prev);

      const lastScrollY = currentScrollY.current;

      // Save the last known scroll position to the outgoing tab
      if (previousTabKey) {
        scrollPositions.current[previousTabKey] = lastScrollY;
      }

      prevPathRef.current = path;

      const nextTabKey = getPersistentTabKey(path);

      // Restore scroll only for persistent tab routes
      if (!nextTabKey) return;

      const newPos = scrollPositions.current[nextTabKey] || 0;

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
        <div className={activeTabKey === "feed" ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Feed onStoryClick={onStoryClick} />
          </PageTransition>
        </div>
      )}

      {/* EXPLORE */}
      {visitedPages.has("explore") && (
        <div className={activeTabKey === "explore" ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Explore />
          </PageTransition>
        </div>
      )}

      {/* REELS */}
      {visitedPages.has("reels") && (
        <div className={activeTabKey === "reels" ? "block min-h-[100dvh]" : "hidden bg-black"}>
          <PageTransition mode="none">
            <Reels />
          </PageTransition>
        </div>
      )}

      {/* MESSAGES */}
      {visitedPages.has("messages") && (
        <div className={activeTabKey === "messages" ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Messages />
          </PageTransition>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {visitedPages.has("notifications") && (
        <div className={activeTabKey === "notifications" ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <Notifications />
          </PageTransition>
        </div>
      )}

      {/* CREATE POST */}
      {visitedPages.has("create") && (
        <div className={activeTabKey === "create" ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <CreatePost />
          </PageTransition>
        </div>
      )}

      {/* EDIT PROFILE */}
      {visitedPages.has("editProfile") && (
        <div className={activeTabKey === "editProfile" ? "block min-h-[100dvh]" : "hidden"}>
          <PageTransition mode="none">
            <EditProfile />
          </PageTransition>
        </div>
      )}
    </div>
  );
}

export default PersistentLayout;
