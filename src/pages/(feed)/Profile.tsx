import React from "react";
import { ArrowLeft, Search, UserX, Ban } from "lucide-react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import { Post } from "@/components/features/post";
import {
  Modal,
  ProfileCard,
  NotFound,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SkeletonPost,
  SkeletonUser,
} from "@/components/ui";
import ProfileSkeleton from "@/components/features/profile/skeleton-profile";
import { useProfile } from "@/hooks/pages/useProfile";
import type { Post as PostType } from "@/types";

const Profile: React.FC = () => {
  const {
    handle,
    profile,
    loading,
    activeProfileTab,
    setActiveProfileTab,
    loadingPosts,
    isFetchingMorePosts,
    hasMorePosts,
    filteredPosts,
    isFollowModalOpen,
    setIsFollowModalOpen,
    followModalType,
    followListData,
    isListLoading,
    isFetchingMoreFollows,
    hasMoreFollows,
    openFollowModal,
    fetchNextFollows,
    handlePostClick,
    handleUserClick,
    loadUserPosts,
    currentUser,
    navigate,
  } = useProfile();

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex min-h-[600px] items-center justify-center overflow-hidden rounded-none border-zinc-100 bg-background md:rounded-xl">
        <NotFound
          title="Account doesn't exist"
          message={`Try searching for another. The user @${handle} could not be found.`}
          icon={UserX}
        />
      </div>
    );
  }

  if (profile.isBanned) {
    return (
      <div className="flex min-h-[600px] items-center justify-center overflow-hidden rounded-none border-zinc-100 bg-background md:rounded-xl">
        <NotFound
          title="This account is banned"
          message={`The user @${handle} has been suspended for violating our community guidelines.`}
          icon={Ban}
        />
      </div>
    );
  }

  const displayProfile = profile;

  const renderPosts = (hideEmpty = false) => {
    if (loadingPosts) {
      return (
        <div className="flex flex-col">
          {[1, 2, 3].map((i) => (
            <SkeletonPost key={i} />
          ))}
        </div>
      );
    }

    if (filteredPosts.length > 0) {
      return (
        <>
          {filteredPosts.map((post: PostType) => (
            <Post
              key={post.feed_id || post.id}
              currentUser={currentUser}
              {...post}
              onClick={() => handlePostClick(post.id)}
              onUserClick={handleUserClick}
            />
          ))}
          {hasMorePosts && (
            <div className="flex justify-center p-6">
              <Button
                variant="secondary"
                className="w-full max-w-xs"
                onClick={() => loadUserPosts()}
                loading={isFetchingMorePosts}
              >
                Load more posts
              </Button>
            </div>
          )}
        </>
      );
    }

    if (hideEmpty) return null;

    return (
      <div className="flex animate-in fade-in flex-col items-center gap-4 p-20 text-center text-zinc-500 duration-500">
        <div className="mb-2 rounded-full bg-zinc-50 p-6 ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
          <Search size={40} className="text-zinc-300 dark:text-zinc-700" />
        </div>
        <h3 className="text-xl font-bold dark:text-white">No posts yet</h3>
        <p className="max-w-[250px] text-sm text-zinc-500 dark:text-zinc-400">
          When @{displayProfile.handle} shares posts, they will appear here.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden rounded-none border-zinc-100 bg-white pb-20 dark:bg-black dark:border-zinc-800 md:rounded-xl">
      <div className="border-y border-zinc-100 dark:border-zinc-800 md:border-b-0">
        <div className="sticky top-0 z-20 border-b border-zinc-100 bg-white/90 p-4 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 md:hidden">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-1 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-col">
              <h5 className="text-lg font-bold leading-none dark:text-white">
                {displayProfile.name}
              </h5>
              <span className="mt-0.5 text-xs text-zinc-500">
                {displayProfile.follower_count || 0} Followers
              </span>
            </div>
          </div>
        </div>
        <ProfileHeader
          profile={displayProfile}
          currentUser={currentUser}
          isCurrentUser={currentUser?.handle === displayProfile.handle}
          onEditProfile={() => navigate("/edit-profile")}
          onShowFollowers={() => openFollowModal("Followers")}
          onShowFollowing={() => openFollowModal("Following")}
        />

        <Tabs
          value={activeProfileTab}
          onValueChange={setActiveProfileTab}
          className="w-full"
        >
          <div className="sticky top-[60px] z-10 border-b border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 md:top-0">
            <TabsList className="hide-scrollbar h-auto w-full justify-start overflow-x-auto rounded-none bg-transparent p-0 px-2">
              {["feed", "media"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 whitespace-nowrap rounded-none border-b-2 px-4 py-4 text-sm font-bold capitalize text-zinc-500 transition-all data-[state=active]:border-black data-[state=active]:text-black dark:data-[state=active]:border-white dark:data-[state=active]:text-white"
                >
                  {tab === "feed" ? "Posts" : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="feed" className="m-0 border-none">
            {renderPosts()}
          </TabsContent>
          <TabsContent value="media" className="m-0 border-none">
            {renderPosts()}
          </TabsContent>
        </Tabs>
      </div>

      <Modal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        title={followModalType}
        description={
          followModalType === "Followers"
            ? `People who follow @${displayProfile.handle}`
            : `People @${displayProfile.handle} follows`
        }
        className="sm:max-w-md"
      >
        <div className="flex max-h-[75vh] flex-col overflow-y-auto">
          <div className="min-h-[300px]">
            {isListLoading ? (
              <div className="flex flex-col">
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonUser key={i} />
                ))}
              </div>
            ) : followListData.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {followListData.map((user: any) => (
                  <ProfileCard
                    key={user.id}
                    profile={user}
                    onUserClick={(h: string) => {
                      setIsFollowModalOpen(false);
                      navigate(`/u/${h}`);
                    }}
                  />
                ))}

                {hasMoreFollows && (
                  <div className="flex justify-center p-4">
                    <Button
                      variant="secondary"
                      className="w-full text-xs"
                      onClick={() => fetchNextFollows()}
                      loading={isFetchingMoreFollows}
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <p className="font-medium">
                  No {followModalType.toLowerCase()} yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
