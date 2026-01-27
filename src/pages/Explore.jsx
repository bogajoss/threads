import React from "react";
import { SkeletonPost, SearchBar, ProfileCard, Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { Loader2, Plus, Users, Hash } from "lucide-react";
import CreateCommunityModal from "@/components/features/modals/CreateCommunityModal";
import { useExplore } from "@/hooks/pages/useExplore";
import { Post } from "@/components/features/post";
import { useToast } from "@/context/ToastContext";

const Explore = () => {
  const { addToast } = useToast();
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isCreateModalOpen,
    setIsCreateModalOpen,
    communitiesData,
    isCommunitiesLoading,
    isFetchingMoreCommunities,
    hasMoreCommunities,
    postsData,
    isPostsLoading,
    isFetchingMorePosts,
    hasMorePosts,
    filteredCommunities,
    handleCommunityClick,
    loadCommunities,
    loadPosts,
    navigate
  } = useExplore();

  if ((isCommunitiesLoading || isPostsLoading) && (!communitiesData.length && !postsData.length)) {
    return (
      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen pb-20 shadow-sm">
      <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800">
        <div className="p-4 flex gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search communities or posts..."
            className="flex-1"
          />
          {currentUser && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="size-11 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
              title="Create Community"
            >
              <Plus size={22} strokeWidth={3} />
            </button>
          )}
        </div>

        <div className="px-1 border-t border-zinc-100 dark:border-zinc-800">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full h-12 bg-transparent p-0 rounded-none border-none gap-8 px-4">
              <TabsTrigger
                value="communities"
                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent px-2 font-bold text-zinc-500 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white transition-all gap-2"
              >
                <Users size={18} />
                Communities
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-violet-600 data-[state=active]:bg-transparent px-2 font-bold text-zinc-500 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white transition-all gap-2"
              >
                <Hash size={18} />
                Posts
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="min-h-screen">
        {activeTab === "communities" && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => (
                <ProfileCard
                  key={community.handle}
                  profile={community}
                  onUserClick={handleCommunityClick}
                  isCommunity={true}
                />
              ))
            ) : (
              <div className="p-20 text-center text-zinc-500">
                <p className="font-bold">No communities found</p>
              </div>
            )}

            {hasMoreCommunities && filteredCommunities.length > 0 && (
              <div className="p-6 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  variant="secondary"
                  className="w-full max-w-xs"
                  onClick={() => loadCommunities(true)}
                  disabled={isFetchingMoreCommunities}
                >
                  {isFetchingMoreCommunities && <Loader2 size={18} className="animate-spin mr-2" />}
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {postsData.length > 0 ? (
              <>
                {postsData.map((post) => (
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
                  <div className="p-6 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
                    <Button
                      variant="secondary"
                      className="w-full max-w-xs"
                      onClick={() => loadPosts(true)}
                      disabled={isFetchingMorePosts}
                    >
                      {isFetchingMorePosts && <Loader2 size={18} className="animate-spin mr-2" />}
                      Load more
                    </Button>
                  </div>
                )}
              </>
            ) : isPostsLoading ? (
              <div className="p-20 flex justify-center">
                <Loader2 className="animate-spin text-violet-500" size={32} />
              </div>
            ) : (
              <div className="p-20 text-center text-zinc-500 flex flex-col items-center gap-3">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-full">
                  <Hash size={32} className="text-zinc-300" />
                </div>
                <p className="font-bold">
                  {searchQuery ? `No posts found matching "${searchQuery}"` : "No posts found"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Explore;
