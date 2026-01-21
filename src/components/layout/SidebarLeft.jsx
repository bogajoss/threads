import React from 'react';
import { Home, Compass, Film, Mail, Bell, User } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SidebarLeft = () => {
    const { currentUser } = useAuth();

    const navItems = [
        { id: 'home', icon: Home, path: '/' },
        { id: 'explore', icon: Compass, path: '/explore' },
        { id: 'reels', icon: Film, path: '/reels' },
        { id: 'messages', icon: Mail, path: '/messages' },
        { id: 'notifications', icon: Bell, path: '/notifications' },
        { id: 'profile', icon: User, path: currentUser ? `/u/${currentUser.handle}` : '/explore' }
    ];

    return (
        <aside className="sticky top-0 flex h-screen w-[68px] flex-col items-center py-5 border-r border-zinc-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-black transition-colors duration-200">
            <Link to="/" className="mb-8 hover:scale-110 transition-transform">
                <img src="https://static.hey.xyz/images/app-icon/0.png" alt="Logo" className="size-8" />
            </Link>

            <nav className="flex flex-col gap-y-4 w-full items-center">
                {navItems.map(item => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            `p-2.5 rounded-xl transition-all duration-200 border border-transparent ${isActive ? 'text-black dark:text-white bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900'}`
                        }
                    >
                        <item.icon size={26} strokeWidth={2.5} />
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default SidebarLeft;
