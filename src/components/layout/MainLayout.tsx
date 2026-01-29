import React from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
    SidebarLeft,
    SidebarRight,
    BottomNav,
    FeedHeader,
    // @ts-ignore
} from "@/components/layout"
import { useTheme } from "@/context/ThemeContext"

interface MainLayoutProps {
    onPostClick: () => void
}

const MainLayout: React.FC<MainLayoutProps> = ({ onPostClick }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { darkMode } = useTheme()

    const isHomePage = location.pathname === "/"

    // Hide bottom nav on reels and specific messages for better UX
    const isNavHidden =
        location.pathname.startsWith("/reels") ||
        (location.pathname.startsWith("/messages") &&
            location.pathname.split("/").length > 2)

    const handleProfileClick = (handle: string) => {
        navigate(`/u/${handle}`)
    }

    return (
        <div
            className={`min-h-screen bg-[--background] text-[--foreground] font-sans selection:bg-violet-500 selection:text-white transition-colors duration-200 ${darkMode ? "dark" : ""}`}
        >
            <div className="mx-auto flex min-h-screen w-full max-w-[1300px] justify-center px-0 sm:px-0">
                {/* Left Sidebar - Fixed narrow icons */}
                <SidebarLeft onPostClick={onPostClick} />

                {/* Main Content Area */}
                <main className="flex flex-1 justify-center gap-x-2 px-0 md:gap-x-8 md:px-4 md:py-5">
                    {/* Center Feed */}
                    <div className="flex w-0 flex-1 flex-col overflow-x-hidden">
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
                </main>
            </div>

            {!isNavHidden && <BottomNav handleProfileClick={handleProfileClick} />}
        </div>
    )
}

export default MainLayout
