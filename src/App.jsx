"use client";

import React, { useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Context
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLightbox } from "@/context/LightboxContext";

// Layout & Components
import { MainLayout, PageTransition } from "@/components/layout";
import { GlobalModals } from "@/components/features/modals";
import StoryViewer from "@/components/features/story/StoryViewer";
import { ImageViewer } from "@/components/ui";
import AuthForm from "@/components/features/auth/AuthForm";

// Pages
import {
  Home,
  Explore,
  Reels,
  Messages,
  Notifications,
  Profile,
  Community,
  PostDetails
} from "@/pages";

import { Plus } from "lucide-react";
import { ScrollToTop } from "@/lib/utils";

export default function Sysm() {
  const location = useLocation();
  const { currentUser, authMode, setAuthMode } = useAuth();
  const { darkMode } = useTheme();
  const { isOpen, images, currentIndex, closeLightbox, setIndex } =
    useLightbox();

  // Modal States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [postCommunity, setPostCommunity] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);

  if (authMode) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
          <PageTransition>
            <AuthForm
              type={authMode}
              onComplete={() => setAuthMode(null)}
              onSwitch={() =>
                setAuthMode(authMode === "login" ? "signup" : "login")
              }
            />
          </PageTransition>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout onPostClick={() => setIsPostModalOpen(true)} />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home
                  onStoryClick={setViewingStory}
                  onAddStory={() => setIsStoryModalOpen(true)}
                />
              </PageTransition>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
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
            path="/messages"
            element={
              <PageTransition>
                <Messages />
              </PageTransition>
            }
          />
          <Route
            path="/messages/:id"
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
            path="/post/:id"
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
                <Community onPostInCommunity={(c) => {
                  setPostCommunity(c);
                  setIsPostModalOpen(true);
                }} />
              </PageTransition>
            }
          />
          <Route
            path="/u/:handle"
            element={
              <PageTransition>
                <Profile
                  onEditProfile={(profile) => {
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

      {/* Global Overlays */}
      <GlobalModals
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={(val) => {
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

      {viewingStory && (
        <StoryViewer
          story={viewingStory}
          onClose={() => setViewingStory(null)}
        />
      )}

      {isOpen && (
        <ImageViewer
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setIndex}
        />
      )}

      {currentUser && location.pathname === "/" && (
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="fixed bottom-20 right-5 md:hidden z-50 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 size-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all cursor-pointer group"
          title="Create Post"
        >
          <Plus
            size={28}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
      )}
    </>
  );
}
