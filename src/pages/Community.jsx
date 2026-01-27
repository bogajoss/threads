import React from "react";
import { ArrowLeft, Loader2, Users, Plus, Settings, Pencil } from "lucide-react";
import { Post } from "@/components/features/post";
import { NotFound, Button, Avatar, AvatarImage, AvatarFallback } from "@/components/ui";
import { EditCommunityModal, ManageMembersModal } from "@/components/features/modals";
import { useCommunity } from "@/hooks/pages/useCommunity";

const Community = ({ onPostInCommunity }) => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = React.useState(false);
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
    currentUser,
    addToast,
    navigate
  } = useCommunity();

  const isAdmin = userRole === 'admin';
  const canPost = isMember && (!community.isPrivate || isAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-[600px] flex items-center justify-center">
        <NotFound 
          title="Community doesn't exist"
          message={`The community @${community?.handle || 'unknown'} could not be found.`}
          icon={Users}
        />
      </div>
    );
  }

  return (
    <div className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
      <div className="relative">
        <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-col">
              <h5 className="text-lg font-bold dark:text-white leading-none">
                {community.name}
              </h5>
              <span className="text-xs text-zinc-500 mt-0.5">
                {community.membersCount} Members
              </span>
            </div>
          </div>
        </div>

        {/* Community Header */}
        <div className="relative">
          <div className="h-32 sm:h-52 bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative">
            {community.cover ? (
              <>
                <img src={community.cover} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
            )}
          </div>
          
          <div className="px-4 pb-6">
            <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4 relative z-10">
              <div className="size-24 sm:size-32 rounded-3xl border-4 border-white dark:border-black bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-xl">
                <img src={community.avatar} className="size-full object-cover" alt="" />
              </div>
              <div className="pb-1 flex gap-2">
                {isAdmin && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 flex items-center justify-center size-10"
                      title="Edit Community"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => setIsMembersModalOpen(true)}
                      className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all active:scale-95 flex items-center justify-center size-10"
                      title="Manage Members"
                    >
                      <Settings size={20} />
                    </button>
                  </div>
                )}
                <Button
                  variant={isMember ? "outline" : "default"}
                  onClick={handleJoinToggle}
                  disabled={isJoining}
                  className={`rounded-full font-bold px-8 h-10 transition-all ${isMember ? "border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 dark:hover:bg-rose-900/20" : "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:scale-105"}`}
                >
                  {isJoining ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    isMember ? "Joined" : "Join"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black dark:text-white tracking-tight leading-tight">
                {community.name}
              </h1>
              <p className="text-zinc-500 font-bold text-sm sm:text-base">c/{community.handle}</p>
              
              {community.description && (
                <p className="mt-4 text-[15px] sm:text-base dark:text-zinc-300 leading-relaxed max-w-2xl">
                  {community.description}
                </p>
              )}

              <div className="flex gap-6 mt-5">
                <div className="flex flex-col">
                  <span className="text-lg font-black dark:text-white">{community.membersCount}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black dark:text-white">{community.postsCount}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800">
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
                  showToast={addToast}
                  {...post}
                  onClick={() => navigate(`/post/${post.id}`)}
                  onUserClick={(h) => navigate(`/u/${h}`)}
                />
              ))}
              {hasMorePosts && (
                <div className="p-6 flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full max-w-xs"
                    onClick={() => loadCommunityPosts(community.id, true)}
                    disabled={isFetchingMorePosts}
                  >
                    {isFetchingMorePosts && <Loader2 size={18} className="animate-spin mr-2" />}
                    Load more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-20 text-center text-zinc-500 flex flex-col items-center gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full mb-2">
                <Users size={40} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">No posts here yet</h3>
              <p className="text-sm max-w-[250px]">
                Be the first to share something in {community.name}!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Plus Button for members with permission */}
      {canPost && (
        <button
          onClick={() => onPostInCommunity(community)}
          className="fixed bottom-20 right-5 md:hidden z-50 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 size-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all cursor-pointer group"
          title={`Post to ${community.name}`}
        >
          <Plus
            size={28}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
        </button>
      )}

      <EditCommunityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        community={community}
        onUpdate={() => {
          // You might need a setCommunity here, but useCommunity currently manages its own state.
          // For now, refreshing the page or re-fetching via hook is best.
          window.location.reload(); 
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
