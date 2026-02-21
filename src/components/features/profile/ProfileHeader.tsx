import React, { useState } from "react";
import {
  MoreHorizontal,
  Mail,
  Bell,
  Share,
  Flag,
  Ban,
  Gavel,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  VerifiedIcon,
  AdminIcon,
  Avatar,
  AvatarImage,
  AvatarFallback,
  SettingsIcon,
  EditIcon,
  FollowIcon,
  FollowingIcon,
  LocationIcon,
  LinkIcon,
} from "@/components/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Actionsheet, ActionsheetItem } from "@/components/ui/actionsheet";
import { useMediaQuery } from "@/hooks";
import { getOrCreateConversation } from "@/lib/api";
import RichText from "@/components/ui/rich-text";

import { useFollow } from "@/hooks/useFollow";
import { useReportModal } from "@/context/ReportContext";
import { useToast } from "@/context/ToastContext";
import { copyToClipboard, getBaseUrl, getSafeImageUrl } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: any;
  currentUser: any;
  isCurrentUser: boolean;
  onEditProfile?: (profile: any) => void;
  isCommunity?: boolean;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

import ProfileSkeleton from "./skeleton-profile";

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  currentUser,
  isCurrentUser,
  onEditProfile,
  isCommunity,
  onShowFollowers,
  onShowFollowing,
}) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { openReport } = useReportModal();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Use hook even if profile is null to avoid hook conditional rules,
  // but we need to be careful. usage of hooks must be consistent.
  // Actually, better to return early ONLY if we can verify hooks aren't compromised.
  // But wait, useFollow expects a profile.
  // It is safer to render Skeleton in the parent or handle it here gracefully.
  // The prompt asks to return ProfileSkeleton if profile is null.

  // Move hook to top level
  // Pass empty object or safe fallback if profile is null to avoid hook errors inside useFollow if it doesn't handle nulls
  // However, useFollow implementation likely expects a valid profile object.
  // We can pass null and ensure useFollow handles it, or pass a dummy object.
  // Looking at useFollow usage: useFollow(profile, currentUser?.id)

  const { isFollowing, stats, loading, handleFollow } = useFollow(
    profile || {},
    currentUser?.id,
  );

  if (!profile) return <ProfileSkeleton />;

  const handleMessageClick = async () => {
    if (!currentUser) {
      addToast("Please sign in to message users", "info");
      return;
    }

    setIsStartingChat(true);
    try {
      const convId = await getOrCreateConversation(currentUser.id, profile.id);
      navigate(`/m/${convId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      addToast("Failed to open chat", "error");
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-32 w-full bg-zinc-200 dark:bg-zinc-800 sm:h-48">
        {profile.cover && (
          <img
            src={getSafeImageUrl(profile.cover, profile.isPro)}
            className="h-full w-full object-cover transition-opacity duration-500"
            alt="Cover"
          />
        )}
        <div className="absolute -bottom-12 left-4 sm:-bottom-16 sm:left-6">
          <div className="relative rounded-full bg-white p-1 shadow-xl ring-4 ring-white dark:bg-black dark:ring-black">
            <Avatar className="size-24 sm:size-32">
              <AvatarImage
                src={getSafeImageUrl(profile.avatar, profile.isPro)}
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
          <div className="min-w-0 flex-1 pr-4"></div>
          <div className="flex shrink-0 gap-2">
            {isCurrentUser ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProfile?.(profile)}
                  className="flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  title="Edit Profile"
                  aria-label="Edit Profile"
                >
                  <EditIcon size={20} />
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  title="Settings"
                  aria-label="Settings"
                >
                  <SettingsIcon size={20} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleMessageClick}
                  disabled={isStartingChat}
                  className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 flex items-center justify-center min-w-[36px]"
                  aria-label="Message"
                >
                  {isStartingChat ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Mail size={20} />
                  )}
                </button>
                <button
                  className="rounded-full border border-zinc-200 p-2 text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                </button>
                <Button
                  variant={isFollowing ? "secondary" : "primary"}
                  onClick={handleFollow}
                  className="flex min-w-0 items-center gap-2 px-4 text-sm sm:min-w-[100px]"
                  loading={loading}
                >
                  {isFollowing ? (
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
                {isDesktop ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        aria-label="More options"
                      >
                        <MoreHorizontal size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => {
                            copyToClipboard(`${getBaseUrl()}/profile/${profile.handle || profile.id}`)
                              .then(() => addToast("Profile link copied!"))
                              .catch(() => addToast("Failed to copy link", "error"));
                          }}
                        >
                          <Share size={16} />
                          Share Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() =>
                            openReport(
                              isCommunity ? "community" : "user",
                              profile.id,
                            )
                          }
                        >
                          <Flag size={16} />
                          Report {isCommunity ? "community" : "user"}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer gap-2"
                          onClick={() => addToast("User blocked", "info")}
                        >
                          <Ban size={16} />
                          Block user
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <button
                      onClick={() => setIsMenuOpen(true)}
                      className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      aria-label="More options"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    <Actionsheet
                      isOpen={isMenuOpen}
                      onClose={() => setIsMenuOpen(false)}
                    >
                      <ActionsheetItem
                        icon={<Share size={18} />}
                        onClick={() => {
                          copyToClipboard(`${getBaseUrl()}/profile/${profile.handle || profile.id}`)
                            .then(() => {
                              addToast("Profile link copied!");
                              setIsMenuOpen(false);
                            })
                            .catch(() => {
                              addToast("Failed to copy link", "error");
                              setIsMenuOpen(false);
                            });
                        }}
                      >
                        Share Profile
                      </ActionsheetItem>
                      <ActionsheetItem
                        icon={<Flag size={18} />}
                        onClick={() => {
                          openReport(
                            isCommunity ? "community" : "user",
                            profile.id,
                          );
                          setIsMenuOpen(false);
                        }}
                      >
                        Report {isCommunity ? "community" : "user"}
                      </ActionsheetItem>
                      <ActionsheetItem
                        variant="destructive"
                        icon={<Ban size={18} />}
                        onClick={() => {
                          addToast("User blocked", "info");
                          setIsMenuOpen(false);
                        }}
                      >
                        Block user
                      </ActionsheetItem>
                    </Actionsheet>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="mt-1 flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {profile.name}
            </h1>
            {profile.role === "admin" && (
              <AdminIcon size={28} />
            )}
            {profile.verified && (
              <VerifiedIcon size={20} />
            )}
            {profile.isBanned && (
              <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-600 dark:bg-rose-500/10 dark:text-rose-500">
                <Gavel size={10} />
                Banned
              </span>
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
          <RichText
            content={profile.bio}
            className="text-zinc-900 dark:text-zinc-100"
          />
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
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
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
                  e.preventDefault();
                  e.stopPropagation();
                  onShowFollowing();
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
                  e.preventDefault();
                  e.stopPropagation();
                  onShowFollowers();
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
  );
};

export default ProfileHeader;
