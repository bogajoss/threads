import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { SearchBar, SignupCard } from "@/components/ui";
import { fetchTrendingHashtags } from "@/lib/api";

const SidebarRight = () => {
  const { currentUser, setAuthMode } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: trendingHashtags = [] } = useQuery({
    queryKey: ["trending-hashtags"],
    queryFn: () => fetchTrendingHashtags(5),
    staleTime: 300000, // Keep data fresh for 5 minutes
    refetchInterval: 60000, // Still refresh in background every minute if desired, or remove if strictly 5 mins
  });

  const footerLinks = [
    "© 2026 Sysm",
    "Terms",
    "Privacy",
    "Guidelines",
    "Discord",
    "Sysm",
    "GitHub",
    "Support",
    "Status",
  ];

  const themeToggleBtn = (
    <button
      onClick={toggleDarkMode}
      className="p-3 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
      title="Toggle Theme"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  if (currentUser) {
    return (
      <aside className="sticky top-5 hidden w-[320px] shrink-0 flex-col gap-y-6 lg:flex overflow-y-auto max-h-screen">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          </div>
          {themeToggleBtn}
        </div>

        {/* Trending Section */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-[--border]">
          <h3 className="font-extrabold text-xl mb-4 px-2 text-[--foreground]">
            What's happening
          </h3>
          <div className="flex flex-col gap-1">
            {trendingHashtags.map((topic) => (
              <div
                key={topic.id}
                onClick={() => navigate(`/tags/${topic.name.replace(/^#/, "")}`)}
                className="px-3 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Trending
                </div>
                <div className="font-bold text-[--foreground]">
                  #{topic.name.replace(/^#/, "")}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {topic.usage_count} posts
                </div>
              </div>
            ))}
            {trendingHashtags.length === 0 && (
              <p className="text-sm text-zinc-500 px-2">No trends yet</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 text-[13px] text-zinc-500 font-medium pb-5">
          {footerLinks.map((link) => (
            <a key={link} href="#" className="hover:underline">
              {link}
            </a>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="sticky top-5 hidden w-[350px] shrink-0 flex-col gap-y-6 lg:flex pr-4">
      {/* Top Auth Buttons + Theme Toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => setAuthMode("signup")}
          className="flex-1 bg-[--card] border border-[--border] py-2.5 rounded-full font-bold text-[--foreground] hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm cursor-pointer"
        >
          Signup
        </button>
        <button
          onClick={() => setAuthMode("login")}
          className="flex-1 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <img
            src="/logo.webp"
            alt=""
            className="size-4 rounded-sm"
          />
          Login
        </button>
        {themeToggleBtn}
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      {/* Account Card */}
      <SignupCard />

      {/* Footer Links */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 text-[13px] text-zinc-500 font-medium pb-5">
        {footerLinks.map((link) => (
          <a key={link} href="#" className="hover:underline">
            {link}
          </a>
        ))}
      </div>
    </aside>
  );
};

export default SidebarRight;
