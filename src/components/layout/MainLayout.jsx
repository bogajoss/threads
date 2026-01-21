import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import BottomNav from './BottomNav';
import { useTheme } from '../../context/ThemeContext';
import FeedHeader from './FeedHeader';
import db from '../../data/db.json';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const isHomePage = location.pathname === '/';

    const handleProfileClick = (handle) => {
        navigate(`/u/${handle}`);
    };

    return (
        <div className={`min-h-screen bg-[--background] text-[--foreground] font-sans selection:bg-violet-500 selection:text-white transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>

            <div className="flex justify-center w-full max-w-[1300px] mx-auto min-h-screen px-0 sm:px-0">
                {/* Left Sidebar - Fixed narrow icons */}
                <SidebarLeft />

                {/* Main Content Area */}
                <div className="flex-1 flex justify-center gap-x-2 md:gap-x-8 py-0 md:py-5 px-0 md:px-4">
                    {/* Center Feed */}
                    <div className="w-full flex flex-col flex-1">
                        {isHomePage && <FeedHeader />}

                        <div className="w-full">
                            <Outlet />
                        </div>
                    </div>

                    {/* Right Sidebar - Now on all pages */}
                    <SidebarRight trendingTopics={db.trendingTopics} />
                </div>
            </div>

            <BottomNav handleProfileClick={handleProfileClick} />
        </div>
    );
};

export default MainLayout;
