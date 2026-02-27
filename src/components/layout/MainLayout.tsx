import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import BottomNav from "./BottomNav";
import FeedHeader from "./FeedHeader";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => {
  const location = useLocation();
  const { darkMode } = useTheme();

  const isHomePage = location.pathname === "/";
  const isReelsPage = location.pathname.startsWith("/r");

  const isNavHidden =
    location.pathname.startsWith("/r") ||
    location.pathname.startsWith("/create") ||
    location.pathname === "/settings" ||
    location.pathname === "/edit-profile" ||
    (location.pathname.startsWith("/m") &&
      (location.pathname.split("/").length > 2 ||
        location.search.includes("with")));

  return (
    <div
      className={cn(
        "min-h-[100dvh] bg-[--background] text-[--foreground] font-sans selection:bg-violet-500 selection:text-white transition-colors duration-200 pt-[env(safe-area-inset-top)]",
        darkMode && "dark",
      )}
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1500px] justify-center px-0 sm:px-0">
        <SidebarLeft />

        <main
          className={`flex w-full flex-1 justify-center px-0 gap-x-0 ${isReelsPage ? "" : "md:px-2 md:py-3 md:gap-x-4 lg:gap-x-8"}`}
        >
          <div className="flex w-full min-w-0 flex-1 flex-col overflow-x-hidden">
            {isHomePage && (
              <div className="w-full max-w-full overflow-hidden">
                <FeedHeader />
              </div>
            )}

            <div className="w-full min-w-0 relative">
              <Outlet />
            </div>
          </div>

          {!location.pathname.startsWith("/m") && !isReelsPage && <SidebarRight />}
        </main>
      </div>

      {!isNavHidden && <BottomNav />}


    </div>
  );
};

export default MainLayout;
