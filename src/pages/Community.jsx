import React, { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Search, Loader2, Users, Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import Post from "@/components/features/post/Post";
import NotFound from "@/components/ui/NotFound";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchCommunityByHandle, fetchCommunityPosts, toggleCommunityMembership, checkIfMember } from "@/lib/api";

const Community = () => {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  
  // Post loading state
  const [communityPosts, setCommunityPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isFetchingMorePosts, setIsFetchingMorePosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  const postsRef = useRef(communityPosts);
  useEffect(() => {
    postsRef.current = communityPosts;
  }, [communityPosts]);

  const loadCommunityPosts = useCallback(async (communityId, isLoadMore = false) => {
    if (!communityId) return;
    if (isLoadMore) setIsFetchingMorePosts(true);
    else setLoadingPosts(true);

    try {
      const currentPosts = postsRef.current;
      const lastTimestamp = isLoadMore && currentPosts.length > 0
        ? currentPosts[currentPosts.length - 1].sort_timestamp
        : null;

      const data = await fetchCommunityPosts(communityId, lastTimestamp, 10);
      
      if (data.length < 10) setHasMorePosts(false);
      else setHasMorePosts(true);

      if (isLoadMore) {
        setCommunityPosts(prev => [...prev, ...data]);
      } else {
        setCommunityPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch community posts:", err);
    } finally {
      setLoadingPosts(false);
      setIsFetchingMorePosts(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const c = await fetchCommunityByHandle(handle);
        setCommunity(c);
        if (c?.id) {
          loadCommunityPosts(c.id);
          if (currentUser) {
            const member = await checkIfMember(c.id, currentUser.id);
            setIsMember(member);
          }
        }
      } catch {
        // Silently fail or handle error
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [handle, currentUser, loadCommunityPosts]);

  const handleJoinToggle = async () => {
    if (!currentUser) return addToast("Please login to join communities", "error");
    
    setIsJoining(true);
    try {
      const joined = await toggleCommunityMembership(community.id, currentUser.id);
      setIsMember(joined);
      setCommunity(prev => ({
        ...prev,
        membersCount: joined ? prev.membersCount + 1 : prev.membersCount - 1
      }));
      addToast(joined ? `Joined ${community.name}` : `Left ${community.name}`);
    } catch {
      addToast("Failed to update membership", "error");
    } finally {
      setIsJoining(false);
    }
  };

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
          message={`The community @${handle} could not be found.`}
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

        {/* Community Header (Simple version of ProfileHeader) */}
        <div className="relative">
          <div className="h-32 sm:h-48 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
            {community.cover && (
              <img src={community.cover} className="w-full h-full object-cover" alt="" />
            )}
          </div>
          <div className="px-4 pb-4">
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="size-24 sm:size-32 rounded-2xl border-4 border-white dark:border-black bg-zinc-100 dark:bg-zinc-800 overflow-hidden shadow-sm">
                <img src={community.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <Button
                variant={isMember ? "outline" : "default"}
                onClick={handleJoinToggle}
                disabled={isJoining}
                className="rounded-full font-bold px-6"
              >
                {isJoining ? <Loader2 size={18} className="animate-spin" /> : (isMember ? "Joined" : "Join")}
              </Button>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black dark:text-white">{community.name}</h1>
              <p className="text-zinc-500 font-medium">@{community.handle}</p>
              {community.description && (
                <p className="mt-3 text-[15px] dark:text-zinc-300 leading-relaxed">
                  {community.description}
                </p>
              )}
              <div className="flex gap-4 mt-4 text-sm text-zinc-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="text-black dark:text-white font-bold">{community.membersCount}</span> Members
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-black dark:text-white font-bold">{community.postsCount}</span> Posts
                </span>
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
    </div>
  );
};

export default Community;
