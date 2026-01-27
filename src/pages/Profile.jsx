import React from "react";
import { ArrowLeft, Search, Loader2, UserX } from "lucide-react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import { Post } from "@/components/features/post";
import { Modal, ProfileCard, NotFound, Button, Tabs, TabsList, TabsTrigger, TabsContent, CreditCard } from "@/components/ui";
import { useProfile } from "@/hooks/pages/useProfile";

const Profile = ({ onEditProfile }) => {
  const {
    handle,
    profile,
    loading,
    setUserPosts,
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
    handlePostClick,
    handleUserClick,
    loadUserPosts,
    currentUser,
    addToast,
    navigate
  } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="animate-spin text-violet-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-[600px] flex items-center justify-center">
        <NotFound 
          title="Account doesn't exist"
          message={`Try searching for another. The user @${handle} could not be found.`}
          icon={UserX}
        />
      </div>
    );
  }

  const displayProfile = profile;

  const renderPosts = (hideEmpty = false) => {
    if (loadingPosts) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-violet-500" size={32} />
        </div>
      );
    }

    if (filteredPosts.length > 0) {
      return (
        <>
          {filteredPosts.map((post) => (
            <Post
              key={post.feed_id || post.id}
              currentUser={currentUser}
              showToast={addToast}
              {...post}
              onClick={() => handlePostClick(post.id)}
              onUserClick={handleUserClick}
              onDelete={(deletedId) => 
                setUserPosts(prev => prev.filter(p => p.id !== deletedId))
              }
            />
          ))}
          {hasMorePosts && (
            <div className="p-6 flex justify-center">
              <Button
                variant="secondary"
                className="w-full max-w-xs"
                onClick={() => loadUserPosts(profile.id, true)}
                disabled={isFetchingMorePosts}
              >
                {isFetchingMorePosts && <Loader2 size={18} className="animate-spin mr-2" />}
                Load more posts
              </Button>
            </div>
          )}
        </>
      );
    }

    if (hideEmpty) return null;

    return (
      <div className="p-20 text-center text-zinc-500 flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full mb-2 ring-1 ring-zinc-100 dark:ring-zinc-800">
          <Search size={40} className="text-zinc-300 dark:text-zinc-700" />
        </div>
        <h3 className="text-xl font-bold dark:text-white">
          {activeProfileTab === "collections" ? "No collections yet" : "No posts yet"}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
          {activeProfileTab === "collections" 
            ? "Saved posts and curated collections will appear here."
            : `When @${displayProfile.handle} shares posts, they will appear here.`}
        </p>
      </div>
    );
  };

  return (
    <div className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
      <div className="border-y md:border-b-0 border-zinc-100 dark:border-zinc-800">
        <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-20 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 md:hidden">
          <div className="flex items-center gap-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:text-white transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            <div className="flex flex-col">
              <h5 className="text-lg font-bold dark:text-white leading-none">
                {displayProfile.name}
              </h5>
              <span className="text-xs text-zinc-500 mt-0.5">
                {displayProfile.posts_count || 0} Posts
              </span>
            </div>
          </div>
        </div>
        <ProfileHeader
          profile={displayProfile}
          currentUser={currentUser}
          isCurrentUser={currentUser?.handle === displayProfile.handle}
          onEditProfile={onEditProfile}
          showToast={addToast}
          onShowFollowers={() => openFollowModal("Followers")}
          onShowFollowing={() => openFollowModal("Following")}
        />

        <Tabs
          value={activeProfileTab}
          onValueChange={setActiveProfileTab}
          className="w-full"
        >
          <div className="sticky top-[60px] md:top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800">
            <TabsList className="w-full h-auto bg-transparent p-0 rounded-none justify-start px-2 overflow-x-auto hide-scrollbar">
              {["feed", "collections", "media"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex-1 py-4 text-sm font-bold capitalize rounded-none border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white text-zinc-500 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 whitespace-nowrap px-4"
                >
                  {tab === "feed" ? "Posts" : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="feed" className="m-0 border-none">
            {renderPosts()}
          </TabsContent>
          <TabsContent value="collections" className="m-0 border-none">
            <CreditCard name={displayProfile.name} number={displayProfile.id} />
            {renderPosts(true)}
          </TabsContent>
          <TabsContent value="media" className="m-0 border-none">
            {renderPosts()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Followers/Following Modal */}
      <Modal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        title={followModalType}
        className="sm:max-w-md"
      >
        <div className="min-h-[300px]">
          {isListLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
          ) : followListData.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 -mx-6">
              {followListData.map((user) => (
                <ProfileCard
                  key={user.id}
                  profile={user}
                  onUserClick={(h) => {
                    setIsFollowModalOpen(false);
                    navigate(`/u/${h}`);
                  }}
                />
              ))}
              
              {hasMoreFollows && (
                <div className="p-4 flex justify-center">
                  <Button
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() => openFollowModal(followModalType, true)}
                    disabled={isFetchingMoreFollows}
                  >
                    {isFetchingMoreFollows ? (
                      <Loader2 size={14} className="animate-spin mr-2" />
                    ) : null}
                    Load more
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <p className="font-medium">No {followModalType.toLowerCase()} yet.</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Profile;