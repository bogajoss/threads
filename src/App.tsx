"use client"

import { useState, Suspense, lazy } from "react"
import { Routes, Route, useLocation, Navigate } from "react-router-dom"

// Context
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { useLightbox } from "@/context/LightboxContext"
import { VideoPlaybackProvider } from "@/context/VideoPlaybackContext"

// Layout & Components
// @ts-ignore
import { MainLayout, PageTransition } from "@/components/layout"
// @ts-ignore
import { GlobalModals } from "@/components/features/modals"
// @ts-ignore
import StoryViewer from "@/components/features/story/StoryViewer"
// @ts-ignore
import { ImageViewer } from "@/components/ui"
import AuthForm from "@/components/features/auth/AuthForm"
import { Loader2 } from "lucide-react"

// Pages (Lazy Loaded)
// @ts-ignore
const Home = lazy(() => import("@/pages/Home"))
// @ts-ignore
const Explore = lazy(() => import("@/pages/Explore"))
// @ts-ignore
const Reels = lazy(() => import("@/pages/Reels"))
// @ts-ignore
const Messages = lazy(() => import("@/pages/Messages"))
// @ts-ignore
const Notifications = lazy(() => import("@/pages/Notifications"))
// @ts-ignore
const Profile = lazy(() => import("@/pages/Profile"))
// @ts-ignore
const Community = lazy(() => import("@/pages/Community"))
// @ts-ignore
const PostDetails = lazy(() => import("@/pages/PostDetails"))
// @ts-ignore
const Settings = lazy(() => import("@/pages/Settings"))
// @ts-ignore
const HashtagFeed = lazy(() => import("@/pages/HashtagFeed"))

import { Plus } from "lucide-react"
import { ScrollToTop } from "@/lib/utils"

const PageLoader = () => (
    <div className="flex h-screen w-full items-center justify-center">
        <Loader2 size={40} className="animate-spin text-violet-500" />
    </div>
)

export default function Sysm() {
    const location = useLocation()
    const { currentUser, authMode, setAuthMode } = useAuth()
    const { darkMode } = useTheme()
    const { isOpen, images, currentIndex, closeLightbox, setIndex } =
        useLightbox()

    // Modal States
    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false)
    const [editProfileData, setEditProfileData] = useState({})
    const [postCommunity, setPostCommunity] = useState(null)
    const [viewingStory, setViewingStory] = useState(null)

    if (authMode) {
        return (
            <div className={darkMode ? "dark" : ""}>
                <div className="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-black">
                    <PageTransition>
                        <AuthForm
                            type={authMode}
                            onComplete={() => setAuthMode(null)}
                            // @ts-ignore
                            onSwitch={() =>
                                setAuthMode(authMode === "login" ? "signup" : "login")
                            }
                        />
                    </PageTransition>
                </div>
            </div>
        )
    }

    return (
        <VideoPlaybackProvider>
            <ScrollToTop />

            <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                    <Route
                        element={
                            <MainLayout onPostClick={() => setIsPostModalOpen(true)} />
                        }
                    >
                        <Route
                            path="/"
                            element={
                                <PageTransition>
                                    <Home
                                        // @ts-ignore
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
                            path="/settings"
                            element={
                                <PageTransition>
                                    <Settings />
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
                                    <Community
                                        onPostInCommunity={(c: any) => {
                                            setPostCommunity(c)
                                            setIsPostModalOpen(true)
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
                                            setEditProfileData(profile)
                                            setIsEditProfileOpen(true)
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
                    setIsPostModalOpen(val)
                    if (!val) setPostCommunity(null)
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
                    onClose={(storyId?: string) => {
                        if (storyId) {
                            const seenStories = JSON.parse(
                                localStorage.getItem("seenStories") || "[]"
                            )
                            if (!seenStories.includes(storyId)) {
                                localStorage.setItem(
                                    "seenStories",
                                    JSON.stringify([...seenStories, storyId])
                                )
                            }
                        }
                        setViewingStory(null)
                    }}
                />
            )}

            {/* @ts-ignore */}
            {isOpen && (
                <ImageViewer
                    images={images.map((img) => (typeof img === "string" ? img : img.url))}
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
    )
}
