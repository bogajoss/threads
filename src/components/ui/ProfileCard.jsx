import React, { useState, useEffect } from "react";
import { Button, VerifiedIcon, FollowIcon, FollowingIcon } from "@/components/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePresence } from "@/context/PresenceContext";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";
import { checkIfMember, toggleCommunityMembership } from "@/lib/api";

const ProfileCard = ({ profile, onUserClick, isCommunity = false }) => {
  const { onlineUsers } = usePresence();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const isOnline = onlineUsers.has(profile.id);

  // Community Membership State
  const [isJoined, setIsJoined] = useState(false);
  const [loadingMember, setLoadingMember] = useState(isCommunity);

  // Follow Logic (only for users)
  const { isFollowing, loading: loadingFollow, handleFollow } = useFollow(
    isCommunity ? null : profile,
    currentUser?.id,
    addToast,
  );

  useEffect(() => {
    if (isCommunity && currentUser && profile.id) {
      checkIfMember(profile.id, currentUser.id)
        .then(setIsJoined)
        .finally(() => setLoadingMember(false));
    } else {
      setLoadingMember(false);
    }
  }, [isCommunity, currentUser, profile.id]);

  const handleJoinToggle = async (e) => {
    e.stopPropagation();
    if (!currentUser) return addToast("Please login to join communities", "error");
    
    setLoadingMember(true);
    try {
      const joined = await toggleCommunityMembership(profile.id, currentUser.id);
      setIsJoined(joined);
      addToast(joined ? `Joined ${profile.name}` : `Left ${profile.name}`);
    } catch {
      addToast("Failed to update membership", "error");
    } finally {
      setLoadingMember(false);
    }
  };

  const isMe = currentUser?.id === profile.id;
  const loading = isCommunity ? loadingMember : loadingFollow;

  return (
    <div
      className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors group cursor-pointer"
      onClick={() => onUserClick(profile.handle)}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar
            className={`size-12 border border-zinc-200 dark:border-zinc-800 shadow-sm ${isCommunity ? "rounded-2xl" : ""}`}
          >
            <AvatarImage
              src={profile.avatar}
              alt={profile.handle}
              className="object-cover"
            />
            <AvatarFallback className={isCommunity ? "rounded-2xl" : ""}>
              {profile.handle?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && !isCommunity && (
            <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full shadow-sm"></span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1">
            {profile.name}
            {profile.verified && <VerifiedIcon size={16} className="text-blue-500 shrink-0" />}
          </span>
          <span className="text-sm text-zinc-500 mt-0.5">
            @{profile.handle}
          </span>
          {isCommunity && (
            <span className="text-xs text-zinc-400 mt-1">
              {profile.membersCount || 0} members
            </span>
          )}
          {!isCommunity && profile.followers && (
            <span className="text-xs text-zinc-400 mt-1">
              {profile.followers} followers
            </span>
          )}
        </div>
      </div>

      {!isMe && (
        <Button
          variant={isCommunity ? (isJoined ? "secondary" : "outline") : (isFollowing ? "secondary" : "outline")}
          className="!w-auto !py-1.5 !px-4 text-sm font-bold rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
          onClick={isCommunity ? handleJoinToggle : (e) => {
            e.stopPropagation();
            handleFollow();
          }}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : isCommunity ? (
            isJoined ? "Joined" : "Join"
          ) : isFollowing ? (
            <>
              <FollowingIcon size={16} />
              Following
            </>
          ) : (
            <>
              <FollowIcon size={16} />
              Follow
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default ProfileCard;
