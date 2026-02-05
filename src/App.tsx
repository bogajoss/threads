"use client";

import { useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Context
import { useAuth } from "@/context/AuthContext";
import { useLightbox } from "@/context/LightboxContext";
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext";

// Layout & Components
import { MainLayout, PageTransition } from "@/components/layout";
import { GlobalModals } from "@/components/features/modals";
// @ts-ignore
import StoryViewer from "@/components/features/story/StoryViewer";
import { ImageViewer } from "@/components/ui";
import { Loader2 } from "lucide-react";

// Pages (Lazy Loaded)
const Home = lazy(() => import("@/pages/(feed)/Feed"));
const Explore = lazy(() => import("@/pages/(feed)/Explore"));
const Reels = lazy(() => import("@/pages/(feed)/Reels"));
const Messages = lazy(() => import("@/pages/(feed)/Messages"));
const Notifications = lazy(() => import("@/pages/(feed)/Notifications"));
const Profile = lazy(() => import("@/pages/(feed)/Profile"));
const Community = lazy(() => import("@/pages/(feed)/Community"));
const PostDetails = lazy(() => import("@/pages/(feed)/PostDetails"));
const Settings = lazy(() => import("@/pages/(feed)/Settings"));
const HashtagFeed = lazy(() => import("@/pages/(feed)/HashtagFeed"));
const Login = lazy(() => import("@/pages/(auth)/login/page"));
const Register = lazy(() => import("@/pages/(auth)/register/page"));

import { Plus } from "lucide-react";
import { ScrollToTop } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Loader2 size={40} className="animate-spin text-violet-500" />
  </div>
);

export default function Sysm() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { isOpen, images, currentIndex, closeLightbox, setIndex } =
    useLightbox();

  // Modal States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [postCommunity, setPostCommunity] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);

  // Initialize Keyboard Shortcuts
  useKeyboardShortcuts();

  return (
    <VideoPlaybackProvider>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <MainLayout onPostClick={() => setIsPostModalOpen(true)} />
            }
          >
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route
              path="/feed"
              element={
                <PageTransition>
                  <Home
                    onStoryClick={setViewingStory}
                    onAddStory={() => setIsStoryModalOpen(true)}
                  />
                </PageTransition>
              }
            />
            <Route path="/home" element={<Navigate to="/feed" replace />} />
            <Route
              path="/community"
              element={
                <PageTransition>
                  <Explore />
                </PageTransition>
              }
            />
            <Route
              path="/reels"
              element={
                <PageTransition>
                  <Reels />
                </PageTransition>
              }
            />
            <Route
              path="/reels/:id"
              element={
                <PageTransition>
                  <Reels />
                </PageTransition>
              }
            />
            <Route
              path="/m"
              element={
                <PageTransition>
                  <Messages />
                </PageTransition>
              }
            />
            <Route
              path="/settings"
              element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              }
            />
            <Route
              path="/m/:id"
              element={
                <PageTransition>
                  <Messages />
                </PageTransition>
              }
            />
            <Route
              path="/notifications"
              element={
                <PageTransition>
                  <Notifications />
                </PageTransition>
              }
            />
            <Route
              path="/p/:id"
              element={
                <PageTransition>
                  <PostDetails />
                </PageTransition>
              }
            />
            <Route
              path="/c/:handle"
              element={
                <PageTransition>
                  <Community
                    onPostInCommunity={(c: any) => {
                      setPostCommunity(c);
                      setIsPostModalOpen(true);
                    }}
                  />
                </PageTransition>
              }
            />
            <Route
              path="/tags/:tag"
              element={
                <PageTransition>
                  <HashtagFeed />
                </PageTransition>
              }
            />
            <Route
              path="/u/:handle"
              element={
                <PageTransition>
                  <Profile
                    onEditProfile={(profile: any) => {
                      setEditProfileData(profile);
                      setIsEditProfileOpen(true);
                    }}
                  />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/community" />} />
          </Route>
        </Routes>
      </Suspense>

      {/* Global Overlays */}
      <GlobalModals
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={(val: boolean) => {
          setIsPostModalOpen(val);
          if (!val) setPostCommunity(null);
        }}
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        isStoryModalOpen={isStoryModalOpen}
        setIsStoryModalOpen={setIsStoryModalOpen}
        editProfileData={editProfileData}
        setEditProfileData={setEditProfileData}
        postCommunity={postCommunity}
      />

      {/* @ts-ignore */}
      {viewingStory && (
        <StoryViewer
          story={viewingStory}
          onClose={(storyId?: string) => {
            if (storyId) {
              const seenStories = JSON.parse(
                localStorage.getItem("seenStories") || "[]",
              );
              if (!seenStories.includes(storyId)) {
                localStorage.setItem(
                  "seenStories",
                  JSON.stringify([...seenStories, storyId]),
                );
              }
            }
            setViewingStory(null);
          }}
        />
      )}

      {isOpen && (
        <ImageViewer
          images={images.map((img) =>
            typeof img === "string" ? img : img.url,
          )}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setIndex}
        />
      )}

      {currentUser && location.pathname === "/" && (
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="group fixed bottom-20 right-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full bg-zinc-950 text-white shadow-2xl transition-all hover:scale-110 active:scale-90 dark:bg-white dark:text-zinc-950 md:hidden"
          title="Create Post"
        >
          <Plus
            size={28}
            className="duration-300 transition-transform group-hover:rotate-90"
          />
        </button>
      )}
    </VideoPlaybackProvider>
  );
}
