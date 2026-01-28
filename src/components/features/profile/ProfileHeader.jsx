import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Calendar,
  MoreHorizontal,
  Mail,
  Bell,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, VerifiedIcon, Avatar, AvatarImage, AvatarFallback, SettingsIcon, EditIcon, FollowIcon, FollowingIcon, LocationIcon, LinkIcon } from "@/components/ui";
import { getOrCreateConversation } from "@/lib/api";
import Linkify from "linkify-react";
import { linkifyOptions } from "@/lib/linkify";

import { useFollow } from "@/hooks/useFollow";

const ProfileHeader = ({
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
    showToast,
  );
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);

  const handleMessageClick = async () => {
    if (!currentUser) {
      showToast("Please sign in to message users");
      return;
    }

    setIsStartingChat(true);
    try {
      const convId = await getOrCreateConversation(currentUser.id, profile.id);
      navigate(`/messages/${convId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      showToast("Failed to open chat");
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-32 sm:h-48 w-full bg-zinc-200 dark:bg-zinc-800">
        {profile.cover && (
          <img
            src={profile.cover}
            className="h-full w-full object-cover transition-opacity duration-500"
            alt="Cover"
          />
        )}
        <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-6">
          <div className="p-1 bg-white dark:bg-black rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-black relative">
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

      <div className="flex flex-col p-4 sm:p-6 pt-16 sm:pt-20 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-4">
            {/* Name moved below avatar in mobile for more space */}
          </div>
          <div className="flex gap-2 shrink-0">
            {isCurrentUser ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProfile(profile)}
                  className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 flex items-center justify-center size-10"
                  title="Edit Profile"
                >
                  <EditIcon size={20} />
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="p-2 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95"
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
                  className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 dark:border-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isStartingChat ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Mail size={20} />
                  )}
                </button>
                <button className="rounded-full p-2 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 dark:border-zinc-800 transition-colors">
                  <Bell size={20} />
                </button>
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  onClick={handleFollow}
                  className="text-sm px-4 min-w-0 sm:min-w-[100px] flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin mx-auto" />
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
                <button className="rounded-full p-2 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 mt-1">
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {profile.name}
            </h1>
            {profile.verified && <VerifiedIcon size={20} className="text-blue-500" />}
          </div>
          {!isCommunity && (
            <div className="flex items-center space-x-3">
              <span className="text-zinc-500 font-medium text-sm px-1.5 py-0.5 -ml-1.5 rounded-md dark:text-zinc-400">
                @{profile.handle}
              </span>
            </div>
          )}
        </div>

        <div className="whitespace-pre-line text-zinc-900 dark:text-zinc-100 leading-relaxed text-sm sm:text-[15px]">
          <Linkify
            options={{
              ...linkifyOptions,
              render: ({ attributes, content: text }) => {
                const { href, ...props } = attributes;
                const isExternal =
                  !href.startsWith("/") &&
                  (href.startsWith("http") || href.startsWith("www"));

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
                      className="text-rose-500 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(href);
                      }}
                    >
                      {text}
                    </span>
                  );
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
                );
              },
            }}
          >
            {profile.bio}
          </Linkify>
        </div>

        {(profile.website || profile.location) && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm pt-1">
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
                  className="text-violet-600 hover:underline font-semibold text-black dark:text-white"
                >
                  {profile.website}
                </a>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-4 sm:gap-6 text-sm pt-2 relative z-10">
          {isCommunity ? (
            <button className="flex gap-x-1 group cursor-pointer">
              <span className="font-bold text-zinc-900 dark:text-white">
                {profile.members}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">Members</span>
            </button>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShowFollowing();
                }}
                className="flex gap-x-1 group cursor-pointer"
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
                  e.preventDefault();
                  e.stopPropagation();
                  onShowFollowers();
                }}
                className="flex gap-x-1 group cursor-pointer"
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
  );
};

export default ProfileHeader;
