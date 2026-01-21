import React from 'react';
import { Home, Compass, Film, Mail, Bell } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = ({ handleProfileClick }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    const navItems = [
        { id: 'home', icon: Home, path: '/' },
        { id: 'explore', icon: Compass, path: '/explore' },
        { id: 'reels', icon: Film, path: '/reels' },
        { id: 'messages', icon: Mail, path: '/messages' },
        { id: 'notifications', icon: Bell, path: '/notifications' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[40] flex h-16 items-center justify-around border-t border-zinc-100 bg-white/90 px-2 pb-safe backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 md:hidden">
            {navItems.map(item => (
                <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center p-2 rounded-full transition-all duration-200 ${isActive ? 'text-black dark:text-white' : 'text-zinc-400 opacity-70'}`
                    }
                >
                    {({ isActive }) => (
                        <item.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                    )}
                </NavLink>
            ))}
            <Link
                to={currentUser ? `/u/${currentUser.handle}` : '/explore'}
                onClick={() => { if (!currentUser) handleProfileClick('demouser'); }}
                className="flex flex-col items-center justify-center p-2"
            >
                <img src={currentUser?.avatar || 'https://static.hey.xyz/images/brands/lens.svg'} className={`size-7 rounded-full object-cover border-2 ${location.pathname.startsWith('/u/') ? 'border-black dark:border-white' : 'border-transparent opacity-70'}`} alt="" />
            </Link>
        </nav>
    );
};

export default BottomNav;
