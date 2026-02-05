import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import BottomNav from "./BottomNav";
import FeedHeader from "./FeedHeader";
import { useTheme } from "@/context/ThemeContext";

interface MainLayoutProps {
  onPostClick: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onPostClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const isHomePage = location.pathname === "/" || location.pathname === "/feed";
  const isReelsPage = location.pathname.startsWith("/reels");

  // Hide bottom nav on reels and specific messages for better UX
  const isNavHidden =
    location.pathname.startsWith("/reels") ||
    (location.pathname.startsWith("/m") &&
      location.pathname.split("/").length > 2);

  const handleProfileClick = (handle: string) => {
    navigate(`/u/${handle}`);
  };

  return (
    <div
      className={`min-h-screen ${isReelsPage ? "h-screen overflow-hidden" : ""} bg-[--background] text-[--foreground] font-sans selection:bg-violet-500 selection:text-white transition-colors duration-200 ${darkMode ? "dark" : ""}`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] justify-center px-0 sm:px-0">
        {/* Left Sidebar - Fixed narrow icons */}
        <SidebarLeft onPostClick={onPostClick} />

        {/* Main Content Area */}
        <main
          className={`flex w-full flex-1 justify-center px-0 gap-x-0 ${isReelsPage ? "" : "md:px-2 md:py-3 md:gap-x-4 lg:gap-x-8"}`}
        >
          {/* Center Feed */}
          <div className="flex w-full min-w-0 flex-1 flex-col overflow-x-hidden">
            {isHomePage && (
              <div className="w-full max-w-full overflow-hidden">
                <FeedHeader />
              </div>
            )}

            <div className="w-full min-w-0">
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar - Now on all pages, except Messages */}
          {!location.pathname.startsWith("/m") && <SidebarRight />}
        </main>
      </div>

      {!isNavHidden && <BottomNav handleProfileClick={handleProfileClick} />}
    </div>
  );
};

export default MainLayout;
