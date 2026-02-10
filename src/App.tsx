"use client";

import { useState, Suspense, lazy } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useLightbox } from "@/context/LightboxContext";
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext";

import {
  MainLayout,
  PageTransition,
  CreateActionMenu,
  MarketplaceLayout,
  InfoLayout,
  AdminLayout,
} from "@/components/layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { GlobalModals } from "@/components/features/modals";
import StoryViewer from "@/components/features/story/StoryViewer";
import { ImageViewer } from "@/components/ui";

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
const CreatePost = lazy(() => import("@/pages/(feed)/CreatePost"));
const Login = lazy(() => import("@/pages/(auth)/login/page"));
const Register = lazy(() => import("@/pages/(auth)/register/page"));
const ProPage = lazy(() => import("@/pages/(marketplace)/pro/page"));

// Admin Pages
const UserManagement = lazy(() => import("@/pages/(admin)/syspanel/sections/users/UserManagement"));
const ReportsManagement = lazy(() => import("@/pages/(admin)/syspanel/sections/reports/ReportsManagement"));

// Info Pages
const Terms = lazy(() => import("@/pages/(info)/Terms"));
const Privacy = lazy(() => import("@/pages/(info)/Privacy"));
const Guidelines = lazy(() => import("@/pages/(info)/Guidelines"));
const Support = lazy(() => import("@/pages/(info)/Support"));
const Status = lazy(() => import("@/pages/(info)/Status"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

import { ScrollToTop } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function Sysm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isOpen, images, currentIndex, closeLightbox, setIndex } =
    useLightbox();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [viewingStory, setViewingStory] = useState(null);

  useKeyboardShortcuts();

  return (
    <VideoPlaybackProvider>
      <ScrollToTop />

      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route
              path="/feed"
              element={
                <PageTransition>
                  <Home onStoryClick={setViewingStory} />
                </PageTransition>
              }
            />
            <Route path="/home" element={<Navigate to="/feed" replace />} />
            <Route
              path="/explore"
              element={
                <PageTransition>
                  <Explore />
                </PageTransition>
              }
            />
            <Route
              path="/r"
              element={
                <PageTransition>
                  <Reels />
                </PageTransition>
              }
            />
            <Route
              path="/r/:id"
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
              path="/create"
              element={
                <PageTransition>
                  <CreatePost />
                </PageTransition>
              }
            />
            <Route
              path="/c/:handle"
              element={
                <PageTransition>
                  <Community
                    onPostInCommunity={(c: any) => {
                      navigate("/create", { state: { initialCommunity: c } });
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
          </Route>

          <Route element={<MarketplaceLayout />}>
            <Route path="/pro" element={<ProPage />} />
          </Route>

          <Route element={<InfoLayout />}>
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/support" element={<Support />} />
            <Route path="/status" element={<Status />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/syspanel"
              element={<Navigate to="/syspanel/users" replace />}
            />
            <Route path="/syspanel/users" element={<UserManagement />} />
            <Route path="/syspanel/reports" element={<ReportsManagement />} />
          </Route>
        </Routes>
      </Suspense>

      <GlobalModals
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        editProfileData={editProfileData}
        setEditProfileData={setEditProfileData}
      />

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
          media={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setIndex}
        />
      )}

      {currentUser && location.pathname === "/feed" && (
        <div className="fixed bottom-20 right-5 z-50 md:hidden">
          <CreateActionMenu triggerClassName="size-12 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950" />
        </div>
      )}
    </VideoPlaybackProvider>
  );
}