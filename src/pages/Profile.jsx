import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Search, Loader2, UserX } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import Post from "@/components/features/post/Post";
import Modal from "@/components/ui/Modal";
import ProfileCard from "@/components/ui/ProfileCard";
import NotFound from "@/components/ui/NotFound";
import Button from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchFollowers, fetchFollowing, fetchPostsByUserId, fetchCommentsByUserId } from "@/lib/api";

const Profile = ({ onEditProfile }) => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { profiles, currentUser, getProfileByHandle } = useAuth();
  const { addToast } = useToast();
  
  const [profile, setProfile] = useState(profiles[handle]);
  const [loading, setLoading] = useState(!profile);
  
  // Post loading state
  const [userPosts, setUserPosts] = useState([]);
  const [activeProfileTab, setActiveProfileTab] = useState("feed");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isFetchingMorePosts, setIsFetchingMorePosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  const userPostsRef = useRef(userPosts);

  useEffect(() => {
    userPostsRef.current = userPosts;
  }, [userPosts]);

  // Followers/Following Modal State
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState("Followers"); // 'Followers' or 'Following'
  const [followListData, setFollowListData] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isFetchingMoreFollows, setIsFetchingMoreFollows] = useState(false);
  const [hasMoreFollows, setHasMoreFollows] = useState(true);

  const followListDataRef = useRef(followListData);
  useEffect(() => {
    followListDataRef.current = followListData;
  }, [followListData]);

  const loadUserPosts = useCallback(async (userId, isLoadMore = false) => {
    if (!userId) return;
    if (isLoadMore) setIsFetchingMorePosts(true);
    else setLoadingPosts(true);

    try {
      const currentPosts = userPostsRef.current;
      const lastTimestamp = isLoadMore && currentPosts.length > 0
        ? currentPosts[currentPosts.length - 1].created_at
        : null;

      const data = await fetchPostsByUserId(userId, lastTimestamp, 10);
      
      if (data.length < 10) setHasMorePosts(false);
      else setHasMorePosts(true);

      if (isLoadMore) {
        setUserPosts(prev => [...prev, ...data]);
      } else {
        setUserPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    } finally {
      setLoadingPosts(false);
      setIsFetchingMorePosts(false);
    }
  }, []);

  const openFollowModal = async (type, isLoadMore = false) => {
    const userId = profile?.id || displayProfile?.id;
    if (!userId) return;

    if (isLoadMore) setIsFetchingMoreFollows(true);
    else {
      setFollowModalType(type);
      setIsFollowModalOpen(true);
      setIsListLoading(true);
      setFollowListData([]);
    }

    try {
      const currentFollowList = followListDataRef.current;
      const lastTimestamp = isLoadMore && currentFollowList.length > 0
        ? currentFollowList[currentFollowList.length - 1].followed_at
        : null;

      const data =
        type === "Followers"
          ? await fetchFollowers(userId, lastTimestamp, 10)
          : await fetchFollowing(userId, lastTimestamp, 10);
      
      if (data.length < 10) setHasMoreFollows(false);
      else setHasMoreFollows(true);

      if (isLoadMore) {
        setFollowListData((prev) => [...prev, ...data]);
      } else {
        setFollowListData(data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
      addToast(`Failed to load ${type}`);
    } finally {
      setIsListLoading(false);
      setIsFetchingMoreFollows(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      let currentProfile = profiles[handle];
      if (!currentProfile) {
        setLoading(true);
        currentProfile = await getProfileByHandle(handle);
        setProfile(currentProfile);
        setLoading(false);
      } else {
        setProfile(currentProfile);
      }

      if (currentProfile?.id) {
        loadUserPosts(currentProfile.id);
      }
    };
    fetchProfileData();
  }, [handle, profiles, getProfileByHandle, loadUserPosts]);

  const filteredPosts = useMemo(() => {
    if (activeProfileTab === "feed") {
      // Personal posts only (no community posts)
      return userPosts.filter((p) => p.community_id === null && p.parent_id === null);
    }
    if (activeProfileTab === "media") {
      return userPosts.filter(
        (p) =>
          p.community_id === null &&
          p.parent_id === null &&
          (p.type === "video" || p.type === "image" || (p.media && p.media.length > 0)),
      );
    }
    if (activeProfileTab === "communities") {
      // Posts made in communities
      return userPosts.filter((p) => p.community_id !== null);
    }
    return userPosts;
  }, [userPosts, activeProfileTab]);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleUserClick = (targetHandle) => {
    if (targetHandle === handle) return;
    navigate(`/u/${targetHandle}`);
  };

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

  const renderPosts = () => {
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
    return (
      <div className="p-20 text-center text-zinc-500 flex flex-col items-center gap-4 animate-in fade-in duration-500">
        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-full mb-2 ring-1 ring-zinc-100 dark:ring-zinc-800">
          <Search size={40} className="text-zinc-300 dark:text-zinc-700" />
        </div>
        <h3 className="text-xl font-bold dark:text-white">No posts yet</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[250px]">
          When @{displayProfile.handle} shares posts, they will appear here.
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
                {userPosts.length} Posts
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
              {["feed", "communities", "media"].map((tab) => (
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
          <TabsContent value="communities" className="m-0 border-none">
            {renderPosts()}
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
