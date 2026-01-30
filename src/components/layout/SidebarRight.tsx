import { useState } from "react"
import { Sun, Moon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
// @ts-ignore
import { SearchBar, SignupCard } from "@/components/ui"
// @ts-ignore
import { fetchTrendingHashtags } from "@/lib/api"

const SidebarRight = () => {
    const { currentUser, setAuthMode } = useAuth()
    const { darkMode, toggleDarkMode } = useTheme()
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const { data: trendingHashtags = [] } = useQuery({
        queryKey: ["trending-hashtags"],
        queryFn: () => fetchTrendingHashtags(5),
        staleTime: 300000, // Keep data fresh for 5 minutes
        refetchInterval: 60000, // Still refresh in background every minute if desired, or remove if strictly 5 mins
    })

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
    ]

    const themeToggleBtn = (
        <button
            onClick={toggleDarkMode}
            className="cursor-pointer rounded-full border border-zinc-100 bg-zinc-50 p-3 text-zinc-500 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
            title="Toggle Theme"
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )

    if (currentUser) {
        return (
            <aside className="sticky top-5 hidden max-h-screen w-[350px] shrink-0 flex-col gap-y-6 overflow-y-auto lg:flex">
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
                <div className="rounded-2xl border border-[--border] bg-zinc-50 p-4 dark:bg-zinc-900">
                    <h3 className="mb-4 px-2 text-xl font-extrabold text-[--foreground]">
                        What's happening
                    </h3>
                    <div className="flex flex-col gap-1">
                        {trendingHashtags.map((topic: any) => (
                            <div
                                key={topic.id}
                                onClick={() =>
                                    navigate(`/tags/${topic.name.replace(/^#/, "")}`)
                                }
                                className="group cursor-pointer rounded-xl px-3 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
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
                            <p className="px-2 text-sm text-zinc-500">No trends yet</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 pb-5 text-[13px] font-medium text-zinc-500">
                    {footerLinks.map((link) => (
                        <a key={link} href="#" className="hover:underline">
                            {link}
                        </a>
                    ))}
                </div>
            </aside>
        )
    }

    return (
        <aside className="sticky top-5 hidden w-[400px] shrink-0 flex-col gap-y-6 pr-4 lg:flex">
            {/* Top Auth Buttons + Theme Toggle */}
            <div className="flex gap-3">
                <button
                    onClick={() => setAuthMode("signup")}
                    className="cursor-pointer flex-1 rounded-full border border-[--border] bg-[--card] py-2.5 font-bold text-[--foreground] shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                    Signup
                </button>
                <button
                    onClick={() => setAuthMode("login")}
                    className="cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-950 py-2.5 font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-950"
                >
                    <img src="/logo.webp" alt="" className="size-4 rounded-sm" />
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
            <div className="flex flex-wrap gap-x-4 gap-y-2 px-2 pb-5 text-[13px] font-medium text-zinc-500">
                {footerLinks.map((link) => (
                    <a key={link} href="#" className="hover:underline">
                        {link}
                    </a>
                ))}
            </div>
        </aside>
    )
}

export default SidebarRight
