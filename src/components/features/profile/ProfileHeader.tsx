import React, { useState } from "react"
import {
    MoreHorizontal,
    Mail,
    Bell,
    Loader2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
// @ts-ignore
import {
    Button,
    VerifiedIcon,
    Avatar,
    AvatarImage,
    AvatarFallback,
    SettingsIcon,
    EditIcon,
    FollowIcon,
    FollowingIcon,
    LocationIcon,
    LinkIcon,
} from "@/components/ui"
// @ts-ignore
import { getOrCreateConversation } from "@/lib/api"
import Linkify from "linkify-react"
import { linkifyOptions } from "@/lib/linkify"

import { useFollow } from "@/hooks/useFollow"

interface ProfileHeaderProps {
    profile: any
    currentUser: any
    isCurrentUser: boolean
    onEditProfile?: (profile: any) => void
    showToast: (message: string) => void
    isCommunity?: boolean
    onShowFollowers: () => void
    onShowFollowing: () => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profile,
    currentUser,
    isCurrentUser,
    onEditProfile,
    showToast,
    isCommunity,
    onShowFollowers,
    onShowFollowing,
}) => {
    const { isFollowing, stats, loading, handleFollow } = useFollow(
        profile,
        currentUser?.id,
        showToast
    )
    const navigate = useNavigate()
    const [isStartingChat, setIsStartingChat] = useState(false)

    const handleMessageClick = async () => {
        if (!currentUser) {
            showToast("Please sign in to message users")
            return
        }

        setIsStartingChat(true)
        try {
            const convId = await getOrCreateConversation(currentUser.id, profile.id)
            navigate(`/messages/${convId}`)
        } catch (error) {
            console.error("Failed to start conversation:", error)
            showToast("Failed to open chat")
        } finally {
            setIsStartingChat(false)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-32 w-full bg-zinc-200 dark:bg-zinc-800 sm:h-48">
                {profile.cover && (
                    <img
                        src={profile.cover}
                        className="h-full w-full object-cover transition-opacity duration-500"
                        alt="Cover"
                    />
                )}
                <div className="absolute -bottom-12 left-4 sm:-bottom-16 sm:left-6">
                    <div className="relative rounded-full bg-white p-1 shadow-xl ring-4 ring-white dark:bg-black dark:ring-black">
                        <Avatar className="size-24 sm:size-32">
                            <AvatarImage
                                src={profile.avatar}
                                alt={profile.handle}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-4xl font-bold">
                                {profile.handle?.[0]?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-4 p-4 pt-16 sm:p-6 sm:pt-20">
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1 pr-4">
                        {/* Name moved below avatar in mobile for more space */}
                    </div>
                    <div className="flex shrink-0 gap-2">
                        {isCurrentUser ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEditProfile?.(profile)}
                                    className="flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                    title="Edit Profile"
                                >
                                    <EditIcon size={20} />
                                </button>
                                <button
                                    onClick={() => navigate("/settings")}
                                    className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                    title="Settings"
                                >
                                    <SettingsIcon size={20} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={handleMessageClick}
                                    disabled={isStartingChat}
                                    className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                >
                                    {isStartingChat ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Mail size={20} />
                                    )}
                                </button>
                                <button className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900">
                                    <Bell size={20} />
                                </button>
                                <Button
                                    variant={isFollowing ? "secondary" : "primary"}
                                    onClick={handleFollow}
                                    className="flex min-w-0 items-center gap-2 px-4 text-sm sm:min-w-[100px]"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 size={16} className="mx-auto animate-spin" />
                                    ) : isFollowing ? (
                                        <>
                                            <FollowingIcon size={18} />
                                            <span className="hidden sm:inline">Following</span>
                                        </>
                                    ) : (
                                        <>
                                            <FollowIcon size={18} />
                                            <span className="hidden sm:inline">Follow</span>
                                        </>
                                    )}
                                </Button>
                                <button className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                    <MoreHorizontal size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-0.5">
                    <div className="mt-1 flex items-center gap-1.5">
                        <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                            {profile.name}
                        </h1>
                        {profile.verified && (
                            <VerifiedIcon size={20} className="text-blue-500" />
                        )}
                    </div>
                    {!isCommunity && (
                        <div className="flex items-center space-x-3">
                            <span className="-ml-1.5 rounded-md px-1.5 py-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                @{profile.handle}
                            </span>
                        </div>
                    )}
                </div>

                <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 sm:text-[15px]">
                    <Linkify
                        options={{
                            ...linkifyOptions,
                            render: ({ attributes, content: text }) => {
                                const { href, ...props } = attributes
                                const isExternal =
                                    !href.startsWith("/") &&
                                    (href.startsWith("http") || href.startsWith("www"))

                                if (
                                    href.startsWith("/u/") ||
                                    href.startsWith("/tags/") ||
                                    href.startsWith("/c/") ||
                                    href.startsWith("/explore")
                                ) {
                                    return (
                                        <span
                                            key={text}
                                            {...props}
                                            className="cursor-pointer font-bold text-rose-500 hover:underline dark:text-rose-400"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(href)
                                            }}
                                        >
                                            {text}
                                        </span>
                                    )
                                }
                                return (
                                    <a
                                        key={text}
                                        href={href}
                                        {...props}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                    >
                                        {text}
                                    </a>
                                )
                            },
                        }}
                    >
                        {profile.bio}
                    </Linkify>
                </div>

                {(profile.website || profile.location) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1 text-sm">
                        {profile.location && (
                            <span className="flex items-center gap-1">
                                <LocationIcon size={14} />
                                {profile.location}
                            </span>
                        )}
                        {profile.website && (
                            <span className="flex items-center gap-1">
                                <LinkIcon size={14} />
                                <a
                                    href={`https://${profile.website}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-black hover:underline dark:text-white"
                                >
                                    {profile.website}
                                </a>
                            </span>
                        )}
                    </div>
                )}

                <div className="relative z-10 flex gap-4 pt-2 text-sm sm:gap-6">
                    {isCommunity ? (
                        <button className="group flex cursor-pointer gap-x-1">
                            <span className="font-bold text-zinc-900 dark:text-white">
                                {profile.members}
                            </span>
                            <span className="text-zinc-500 dark:text-zinc-400">Members</span>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onShowFollowing()
                                }}
                                className="group flex cursor-pointer gap-x-1"
                            >
                                <span className="font-bold text-zinc-900 dark:text-white">
                                    {stats.following}
                                </span>
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Following
                                </span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    onShowFollowers()
                                }}
                                className="group flex cursor-pointer gap-x-1"
                            >
                                <span className="font-bold text-zinc-900 dark:text-white">
                                    {stats.followers}
                                </span>
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Followers
                                </span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader
