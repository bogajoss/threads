import React from "react";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import Button from "@/components/ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePresence } from "@/context/PresenceContext";
import { useFollow } from "@/hooks/useFollow";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Loader2 } from "lucide-react";

const ProfileCard = ({ profile, onUserClick, isCommunity = false }) => {
  const { onlineUsers } = usePresence();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const isOnline = onlineUsers.has(profile.id);

  const { isFollowing, loading, handleFollow } = useFollow(
    profile,
    currentUser?.id,
    addToast,
  );

  const isMe = currentUser?.id === profile.id;

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
          <div className="flex items-center gap-1">
            <span className="font-bold text-zinc-900 dark:text-white leading-none">
              {profile.name}
            </span>
            {profile.verified && <VerifiedBadge />}
          </div>
          <span className="text-sm text-zinc-500 mt-0.5">
            @{profile.handle}
          </span>
          {isCommunity && profile.members && (
            <span className="text-xs text-zinc-400 mt-1">
              {profile.members} members
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
          variant={isFollowing ? "secondary" : "outline"}
          className="!w-auto !py-1.5 !px-4 text-sm font-bold rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          onClick={(e) => {
            e.stopPropagation();
            handleFollow();
          }}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : isFollowing ? (
            "Following"
          ) : isCommunity ? (
            "Join"
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </div>
  );
};

export default ProfileCard;
