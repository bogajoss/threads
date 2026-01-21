'use client'

import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Context
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';

// Layout & Components
import MainLayout from './components/layout/MainLayout';
import GlobalModals from './components/features/modals/GlobalModals';
import StoryViewer from './components/features/story/StoryViewer';
import AuthForm from './components/features/auth/AuthForm';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Reels from './pages/Reels';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import PostDetails from './pages/PostDetails';

import { Plus } from 'lucide-react';
import db from './data/db.json';

// --- Utils ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function HeyClone() {
  const location = useLocation();
  const { currentUser, authMode, setAuthMode } = useAuth();
  const { addToast } = useToast();
  const { darkMode } = useTheme();

  // Modal States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});
  const [viewingStory, setViewingStory] = useState(null);

  if (authMode) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
          <AuthForm
            type={authMode}
            onComplete={() => setAuthMode(null)}
            onSwitch={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home onStoryClick={setViewingStory} onAddStory={() => addToast("Add story feature coming soon!")} />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels reels={db.reels.map(r => ({ ...r, user: db.profiles[r.userHandle] }))} />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/u/:handle" element={<Profile onEditProfile={(profile) => { setEditProfileData(profile); setIsEditProfileOpen(true); }} />} />
          <Route path="*" element={<Navigate to="/explore" />} />
        </Route>
      </Routes>

      {/* Global Overlays */}
      <GlobalModals
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={setIsPostModalOpen}
        isEditProfileOpen={isEditProfileOpen}
        setIsEditProfileOpen={setIsEditProfileOpen}
        editProfileData={editProfileData}
        setEditProfileData={setEditProfileData}
      />

      {viewingStory && (
        <StoryViewer story={viewingStory} onClose={() => setViewingStory(null)} />
      )}

      {/* Floating Action Button (Mobile Only) */}
      {currentUser && !['/messages', '/reels'].includes(location.pathname) && (
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="fixed bottom-20 right-5 z-40 bg-zinc-900 dark:bg-white text-white dark:text-black size-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform md:hidden"
        >
          <Plus size={28} />
        </button>
      )}
    </>
  );
}