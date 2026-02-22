"use client";

import { useState, Suspense, lazy } from "react";
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { useLightbox } from "@/context/LightboxContext";
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext";
import { useDeepLinks } from "@/hooks/useDeepLinks";

import {
  MainLayout,
  PageTransition,
  MarketplaceLayout,
  InfoLayout,
  AdminLayout,
} from "@/components/layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { GlobalModals } from "@/components/features/modals";
import StoryViewer from "@/components/features/story/StoryViewer";
import { ImageViewer } from "@/components/ui";
import { ScrollToTop } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const Profile = lazy(() => import("@/pages/(feed)/Profile"));
const Community = lazy(() => import("@/pages/(feed)/Community"));
const PostDetails = lazy(() => import("@/pages/(feed)/PostDetails"));
const Settings = lazy(() => import("@/pages/(feed)/Settings"));
const HashtagFeed = lazy(() => import("@/pages/(feed)/HashtagFeed"));
const CreateCommunity = lazy(() => import("@/pages/(feed)/CreateCommunity"));
const CreateGroup = lazy(() => import("@/pages/(feed)/CreateGroup"));
const Login = lazy(() => import("@/pages/(auth)/login/page"));
const Register = lazy(() => import("@/pages/(auth)/register/page"));
const Onboarding = lazy(() => import("@/pages/(onboarding)/onboarding"));
const ProPage = lazy(() => import("@/pages/(marketplace)/pro/page"));

// Admin Pages
const UserManagement = lazy(
  () => import("@/pages/(admin)/syspanel/sections/users/UserManagement"),
);
const ReportsManagement = lazy(
  () => import("@/pages/(admin)/syspanel/sections/reports/ReportsManagement"),
);

// Info Pages
const Terms = lazy(() => import("@/pages/(info)/Terms"));
const Privacy = lazy(() => import("@/pages/(info)/Privacy"));
const Guidelines = lazy(() => import("@/pages/(info)/Guidelines"));
const Support = lazy(() => import("@/pages/(info)/Support"));
const Status = lazy(() => import("@/pages/(info)/Status"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const Reels = lazy(() => import("@/pages/(feed)/Reels"));
const Messages = lazy(() => import("@/pages/(feed)/Messages"));

export default function Mysys() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isOpen, images, currentIndex, closeLightbox, setIndex } =
    useLightbox();

  const [viewingStory, setViewingStory] = useState(null);

  useKeyboardShortcuts();
  useDeepLinks(); // Handle deep links

  return (
    <VideoPlaybackProvider>
      <ScrollToTop />

      <Suspense fallback={null}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            <Route element={currentUser ? <MainLayout onStoryClick={setViewingStory} /> : <MainLayout onStoryClick={setViewingStory} />}>
              <Route path="/" element={null} />
              <Route path="/feed" element={null} />
              <Route path="/home" element={null} />
              <Route path="/explore" element={null} />
              <Route path="/r" element={null} />
              <Route path="/m" element={null} />
              <Route path="/notifications" element={null} />
              
              <Route
                path="/r/:id"
                element={
                  <PageTransition>
                    <Reels />
                  </PageTransition>
                }
              />
              <Route path="/m/:id" element={<PageTransition><Messages /></PageTransition>} />

              <Route
                path="/settings"
                element={
                  <PageTransition>
                    <Settings />
                  </PageTransition>
                }
              />

              <Route path="/p/:id" element={<PageTransition><PostDetails /></PageTransition>} />
              <Route path="/create" element={null} />
              <Route
                path="/create-community"
                element={
                  <PageTransition>
                    <CreateCommunity />
                  </PageTransition>
                }
              />
              <Route
                path="/create-group"
                element={
                  <PageTransition>
                    <CreateGroup />
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
                    <Profile />
                  </PageTransition>
                }
              />
              <Route path="/edit-profile" element={null} />
              
              {/* Correctly nest MarketplaceLayout */}
              <Route element={<MarketplaceLayout />}>
                 <Route path="/pro" element={<ProPage />} />
              </Route>

            </Route>
            
            <Route path="/syspanel" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<ReportsManagement />} />
            </Route>

            <Route path="/info" element={<InfoLayout />}>
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="guidelines" element={<Guidelines />} />
              <Route path="support" element={<Support />} />
              <Route path="status" element={<Status />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {isOpen && (
        <ImageViewer
          media={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setIndex}
        />
      )}

      {viewingStory && (
        <StoryViewer
          story={viewingStory}
          onClose={() => setViewingStory(null)}
        />
      )}

      <GlobalModals />
    </VideoPlaybackProvider>
  );
}
