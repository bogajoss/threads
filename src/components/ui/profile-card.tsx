import React, { useState, useEffect } from "react"
import {
    Button,
    VerifiedIcon,
    FollowIcon,
    FollowingIcon,
} from "@/components/ui"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { usePresence } from "@/context/PresenceContext"
import { useFollow } from "@/hooks/useFollow"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { Loader2 } from "lucide-react"
import { checkIfMember, toggleCommunityMembership } from "@/lib/api/communities"
import type { User, Community, CommunityShort } from "@/types"

interface ProfileCardProps {
    profile: User | Community | CommunityShort
    onUserClick: (handle: string) => void
    isCommunity?: boolean
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    profile,
    onUserClick,
    isCommunity = false,
}) => {
    const { onlineUsers } = usePresence()
    const { currentUser } = useAuth()
    const { addToast } = useToast()
    const isOnline = onlineUsers.has(profile.id)

    // Community Membership State
    const [isJoined, setIsJoined] = useState(false)
    const [loadingMember, setLoadingMember] = useState(isCommunity)

    // Follow Logic (only for users)
    const {
        isFollowing,
        loading: loadingFollow,
        handleFollow,
    } = useFollow(
        isCommunity ? null : (profile as User),
        currentUser?.id,
        addToast
    )

    useEffect(() => {
        if (isCommunity && currentUser && profile.id) {
            checkIfMember(profile.id, currentUser.id)
                .then(setIsJoined)
                .finally(() => setLoadingMember(false))
        } else {
            setLoadingMember(false)
        }
    }, [isCommunity, currentUser, profile.id])

    const handleJoinToggle = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!currentUser)
            return addToast("Please login to join communities", "error")

        setLoadingMember(true)
        try {
            const joined = await toggleCommunityMembership(profile.id, currentUser.id)
            setIsJoined(joined)
            addToast(
                joined
                    ? `Joined ${"name" in profile ? profile.name : ""}`
                    : `Left ${"name" in profile ? profile.name : ""}`
            )
        } catch {
            addToast("Failed to update membership", "error")
        } finally {
            setLoadingMember(false)
        }
    }

    const isMe = currentUser?.id === profile.id
    const loading = isCommunity ? loadingMember : loadingFollow
    const handle = profile.handle
    const avatar = profile.avatar
    const name = profile.name
    const followers = "follower_count" in profile ? profile.follower_count : 0
    const membersCount = "membersCount" in profile ? profile.membersCount : 0
    const verified = "verified" in profile ? profile.verified : false

    return (
        <div
            className="group flex cursor-pointer items-center justify-between border-b border-zinc-100 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/40"
            onClick={() => onUserClick(handle)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar
                        className={`size-12 border border-zinc-200 shadow-sm dark:border-zinc-800 ${isCommunity ? "rounded-2xl" : ""}`}
                    >
                        <AvatarImage
                            src={avatar || undefined}
                            alt={handle}
                            className="object-cover"
                        />
                        <AvatarFallback className={isCommunity ? "rounded-2xl" : ""}>
                            {handle?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && !isCommunity && (
                        <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm dark:border-black"></span>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="flex items-center gap-1 truncate font-extrabold text-zinc-900 dark:text-zinc-100">
                        {name}
                        {verified && (
                            <VerifiedIcon size={16} className="shrink-0 text-blue-500" />
                        )}
                    </span>
                    <span className="mt-0.5 text-sm text-zinc-500">@{handle}</span>
                    {isCommunity && (
                        <span className="mt-1 text-xs text-zinc-400">
                            {membersCount || 0} members
                        </span>
                    )}
                    {!isCommunity && followers !== undefined && (
                        <span className="mt-1 text-xs text-zinc-400">
                            {followers} followers
                        </span>
                    )}
                </div>
            </div>

            {!isMe && (
                <Button
                    variant={
                        isCommunity
                            ? isJoined
                                ? "secondary"
                                : "outline"
                            : isFollowing
                                ? "secondary"
                                : "outline"
                    }
                    className="flex !w-auto items-center gap-1.5 rounded-full border-zinc-200 !px-4 !py-1.5 text-sm font-bold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    onClick={
                        isCommunity
                            ? handleJoinToggle
                            : (e: React.MouseEvent) => {
                                e.stopPropagation()
                                handleFollow()
                            }
                    }
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : isCommunity ? (
                        isJoined ? (
                            <>
                                <FollowingIcon size={16} />
                                <span className="hidden sm:inline">Joined</span>
                            </>
                        ) : (
                            <>
                                <FollowIcon size={16} />
                                <span className="hidden sm:inline">Join</span>
                            </>
                        )
                    ) : isFollowing ? (
                        <>
                            <FollowingIcon size={16} />
                            <span className="hidden sm:inline">Following</span>
                        </>
                    ) : (
                        <>
                            <FollowIcon size={16} />
                            <span className="hidden sm:inline">Follow</span>
                        </>
                    )}
                </Button>
            )}
        </div>
    )
}

export default ProfileCard
