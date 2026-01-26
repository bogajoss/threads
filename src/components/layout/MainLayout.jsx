import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarLeft, SidebarRight, BottomNav, FeedHeader } from "@/components/layout";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const MainLayout = ({ onPostClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const isHomePage = location.pathname === "/";

  // Hide bottom nav on reels and specific messages for better UX
  const isNavHidden =
    location.pathname.startsWith("/reels") ||
    (location.pathname.startsWith("/messages") && location.pathname.split("/").length > 2);

  const handleProfileClick = (handle) => {
    navigate(`/u/${handle}`);
  };

  return (
    <div
      className={`min-h-screen bg-[--background] text-[--foreground] font-sans selection:bg-violet-500 selection:text-white transition-colors duration-200 ${darkMode ? "dark" : ""}`}
    >
      <div className="flex justify-center w-full max-w-[1300px] mx-auto min-h-screen px-0 sm:px-0">
        {/* Left Sidebar - Fixed narrow icons */}
        <SidebarLeft onPostClick={onPostClick} />

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex justify-center gap-x-2 md:gap-x-8 py-0 md:py-5 px-0 md:px-4",
            !isNavHidden && "pb-24 md:pb-0",
          )}
        >
          {/* Center Feed */}
          <div className="flex flex-col flex-1 w-0 overflow-x-hidden">
            {isHomePage && (
              <div className="w-full max-w-full overflow-hidden">
                <FeedHeader />
              </div>
            )}

            <div className="w-full">
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar - Now on all pages, except Messages */}
          {!location.pathname.startsWith("/messages") && <SidebarRight />}
        </div>
      </div>

      {!isNavHidden && <BottomNav handleProfileClick={handleProfileClick} />}
    </div>
  );
};

export default MainLayout;
