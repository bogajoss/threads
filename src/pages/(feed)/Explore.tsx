import React from "react";
import {
  SkeletonPost,
  SearchBar,
  ProfileCard,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  SkeletonUser,
} from "@/components/ui";
import { Plus, Users, Hash, UserCircle } from "lucide-react";
import { useExplore } from "@/hooks/pages/useExplore";
import { Post } from "@/components/features/post";
import type { Post as PostType, Community } from "@/types";

const Explore: React.FC = () => {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    communitiesData,
    isCommunitiesLoading,
    isFetchingMoreCommunities,
    hasMoreCommunities,
    postsData,
    isPostsLoading,
    isFetchingMorePosts,
    hasMorePosts,
    filteredCommunities,
    usersData,
    isUsersLoading,
    isFetchingMoreUsers,
    hasMoreUsers,
    handleCommunityClick,
    loadCommunities,
    loadPosts,
    loadUsers,
    navigate,
  } = useExplore();

  if (
    (isCommunitiesLoading || isPostsLoading || isUsersLoading) &&
    !communitiesData.length &&
    !postsData.length &&
    !usersData.length
  ) {
    return (
      <div className="min-h-screen bg-white dark:bg-black md:rounded-xl">
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 dark:bg-black md:rounded-xl">
      <div className="sticky top-0 z-10 border-b border-zinc-50 bg-white/90 backdrop-blur-md dark:bg-black/90 dark:border-zinc-900/50">
        <div className="flex gap-2 p-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search communities or posts..."
            className="flex-1"
          />
          {currentUser && (
            <button
              onClick={() => navigate("/create-community")}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-zinc-950"
              title="Create Community"
            >
              <Plus size={22} strokeWidth={3} />
            </button>
          )}
        </div>

        <div className="border-t border-zinc-50 px-1 dark:border-zinc-900/50">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="gap-8 rounded-none border-none bg-transparent p-0 px-4 w-full h-12">
              <TabsTrigger
                value="communities"
                className="flex h-full gap-2 rounded-none border-b-2 border-transparent px-2 font-bold text-zinc-500 transition-all data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white"
              >
                <Users size={18} />
                Communities
              </TabsTrigger>
              <TabsTrigger
                value="posts"
                className="flex h-full gap-2 rounded-none border-b-2 border-transparent px-2 font-bold text-zinc-500 transition-all data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white"
              >
                <Hash size={18} />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex h-full gap-2 rounded-none border-b-2 border-transparent px-2 font-bold text-zinc-500 transition-all data-[state=active]:border-violet-600 data-[state=active]:bg-transparent data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white"
              >
                <UserCircle size={18} />
                Users
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="min-h-screen">
        {activeTab === "communities" && (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community: Community) => (
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
              <div className="flex justify-center border-t border-zinc-50 p-6 dark:border-zinc-900/50">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => loadCommunities()}
                  disabled={isFetchingMoreCommunities}
                >
                  {isFetchingMoreCommunities && (
                    <span className="mr-2 animate-pulse">...</span>
                  )}
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
            {postsData.length > 0 ? (
              <>
                {postsData.map((post: PostType & { feed_id?: string }) => (
                  <Post
                    key={post.feed_id || post.id}
                    currentUser={currentUser}
                    {...post}
                    onClick={() => navigate(`/p/${post.id}`)}
                    onUserClick={(h: string) => navigate(`/u/${h}`)}
                  />
                ))}
                {hasMorePosts && (
                  <div className="flex justify-center border-t border-zinc-50 p-6 dark:border-zinc-900/50">
                    <Button
                      variant="secondary"
                      className="w-full max-w-xs"
                      onClick={() => loadPosts()}
                      disabled={isFetchingMorePosts}
                    >
                      {" "}
                      {isFetchingMorePosts && (
                        <span className="mr-2 animate-pulse">...</span>
                      )}
                      Load more
                    </Button>
                  </div>
                )}
              </>
            ) : isPostsLoading ? (
              <div className="flex flex-col">
                {[1, 2, 3].map((i) => (
                  <SkeletonPost key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-20 text-center text-zinc-500">
                <div className="rounded-full bg-zinc-50 p-4 dark:bg-zinc-900">
                  <Hash size={32} className="text-zinc-300" />
                </div>
                <p className="font-bold">
                  {searchQuery
                    ? `No posts found matching "${searchQuery}"`
                    : "No posts found"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
            {usersData.length > 0 ? (
              <>
                {usersData.map((user: any) => (
                  <ProfileCard
                    key={user.id}
                    profile={user}
                    onUserClick={(h: string) => navigate(`/u/${h}`)}
                  />
                ))}
                {hasMoreUsers && (
                  <div className="flex justify-center border-t border-zinc-50 p-6 dark:border-zinc-900/50">
                    <Button
                      variant="secondary"
                      className="w-full max-w-xs"
                      onClick={() => loadUsers()}
                      disabled={isFetchingMoreUsers}
                    >
                      {isFetchingMoreUsers && (
                        <span className="mr-2 animate-pulse">...</span>
                      )}
                      Load more
                    </Button>
                  </div>
                )}
              </>
            ) : isUsersLoading ? (
              <div className="flex flex-col">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonUser key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-20 text-center text-zinc-500">
                <div className="rounded-full bg-zinc-50 p-4 dark:bg-zinc-900">
                  <UserCircle size={32} className="text-zinc-300" />
                </div>
                <p className="font-bold">
                  {searchQuery
                    ? `No users found matching "${searchQuery}"`
                    : "No users found"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default Explore;
