import React, { useState } from "react";
import { Loader2, ArrowLeft, Users } from "lucide-react";
import { Post } from "@/components/features/post";
import {
  NotFound,
  Button,
  SettingsIcon,
  EditIcon,
  FollowIcon,
  FollowingIcon,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui";
import {
  EditCommunityModal,
  ManageMembersModal,
} from "@/components/features/modals";
import { useCommunity } from "@/hooks/pages/useCommunity";

interface CommunityProps {
  onPostInCommunity: (community: any) => void;
}

const Community: React.FC<CommunityProps> = ({ onPostInCommunity }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const {
    community,
    loading,
    isMember,
    userRole,
    isJoining,
    communityPosts,
    loadingPosts,
    isFetchingMorePosts,
    hasMorePosts,
    handleJoinToggle,
    loadCommunityPosts,
    refetchCommunity,
    currentUser,
    navigate,
  } = useCommunity();

  const isAdmin = userRole === "admin";
  const canPost = isMember && (!community?.isPrivate || isAdmin);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={40} className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex min-h-[600px] items-center justify-center overflow-hidden rounded-none bg-white dark:bg-black md:rounded-xl">
        <NotFound
          title="Community doesn't exist"
          message="Try searching for another. The community could not be found."
          icon={Users}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden rounded-none border-zinc-100 bg-white pb-20 dark:border-zinc-800 dark:bg-black md:rounded-xl">
      <div className="relative">
        <div className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 px-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-1 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-col">
              <h5 className="text-lg font-bold leading-none dark:text-white">
                {community.name}
              </h5>
              <span className="mt-0.5 text-xs text-zinc-500">
                {community.membersCount} Members
              </span>
            </div>
          </div>
        </div>

        {/* Community Header */}
        <div className="relative">
          <div className="relative h-32 overflow-hidden bg-zinc-100 dark:bg-zinc-900 sm:h-52">
            {community.cover ? (
              <>
                <img
                  src={community.cover}
                  className="h-full w-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
            )}
          </div>

          <div className="px-4 pb-6">
            <div className="relative z-10 -mt-12 mb-4 flex items-end justify-between sm:-mt-16">
              <div className="size-24 overflow-hidden rounded-3xl border-4 border-white bg-zinc-100 shadow-xl dark:border-black dark:bg-zinc-800 sm:size-32">
                <img
                  src={community.avatar}
                  className="size-full object-cover"
                  alt=""
                />
              </div>
              <div className="flex gap-2 pb-1">
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      title="Edit Community"
                    >
                      <EditIcon size={20} />
                    </button>
                    <button
                      onClick={() => setIsMembersModalOpen(true)}
                      className="flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      title="Settings"
                    >
                      <SettingsIcon size={20} />
                    </button>
                  </div>
                )}
                <Button
                  variant={isMember ? "outline" : "primary"}
                  onClick={handleJoinToggle}
                  disabled={isJoining}
                  className={`flex h-10 items-center justify-center gap-2 rounded-full px-4 font-bold transition-all ${isMember ? "border-zinc-200 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-500 dark:border-zinc-800 dark:hover:bg-rose-900/20" : "bg-zinc-950 text-white hover:scale-105 dark:bg-white dark:text-zinc-950"}`}
                >
                  {isJoining ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isMember ? (
                    <>
                      <FollowingIcon size={18} />
                      <span className="hidden sm:inline">Joined</span>
                    </>
                  ) : (
                    <>
                      <FollowIcon size={18} />
                      <span className="hidden sm:inline">Join</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black leading-tight tracking-tight dark:text-white sm:text-3xl">
                {community.name}
              </h1>
              <p className="text-sm font-bold text-zinc-500 sm:text-base">
                c/{community.handle}
              </p>

              {community.description && (
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed dark:text-zinc-300 sm:text-base">
                  {community.description}
                </p>
              )}

              <div className="relative z-10 flex gap-4 pt-2 text-sm sm:gap-6">
                <button className="group flex cursor-pointer items-baseline gap-x-1.5">
                  <span className="text-base font-extrabold text-zinc-900 transition-colors dark:text-white">
                    {community.membersCount}
                  </span>
                  <span className="font-medium text-zinc-500 dark:text-zinc-400">
                    Members
                  </span>
                </button>
                <button className="group flex cursor-pointer items-baseline gap-x-1.5">
                  <span className="text-base font-extrabold text-zinc-900 transition-colors dark:text-white">
                    {community.postsCount}
                  </span>
                  <span className="font-medium text-zinc-500 dark:text-zinc-400">
                    Posts
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {/* Create Post Entry Box */}
          {canPost && (
            <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage
                    src={currentUser?.avatar}
                    alt={currentUser?.handle}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {currentUser?.handle?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => onPostInCommunity(community)}
                  className="flex-1 rounded-2xl bg-zinc-100 px-5 py-3 text-left text-[15px] font-medium text-zinc-500 transition-all hover:bg-zinc-200/70 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
                >
                  Share something in {community.name}...
                </button>
              </div>
            </div>
          )}

          {loadingPosts ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
          ) : communityPosts.length > 0 ? (
            <>
              {communityPosts.map((post) => (
                <Post
                  key={post.feed_id || post.id}
                  currentUser={currentUser}
                  {...post}
                  onClick={() => navigate(`/p/${post.id}`)}
                  onUserClick={(h: string) => navigate(`/u/${h}`)}
                />
              ))}
              {hasMorePosts && (
                <div className="flex justify-center p-6">
                  <Button
                    variant="secondary"
                    className="w-full max-w-xs"
                    onClick={() => loadCommunityPosts()}
                    disabled={isFetchingMorePosts}
                  >
                    {isFetchingMorePosts && (
                      <Loader2 size={18} className="mr-2 animate-spin" />
                    )}
                    Load more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 p-20 text-center text-zinc-500">
              <div className="mb-2 rounded-full bg-zinc-50 p-6 dark:bg-zinc-900">
                <Users size={40} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">
                No posts here yet
              </h3>
              <p className="text-sm max-w-[250px]">
                Be the first to share something in {community.name}!
              </p>
            </div>
          )}
        </div>
      </div>

      <EditCommunityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        community={community}
        onUpdate={() => {
          refetchCommunity();
        }}
      />

      <ManageMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        community={community}
      />
    </div>
  );
};

export default Community;
