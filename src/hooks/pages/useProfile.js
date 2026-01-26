import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchFollowers, fetchFollowing, fetchPostsByUserId } from "@/lib/api";

export const useProfile = () => {
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
    const userId = profile?.id;
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

  return {
    handle,
    profile,
    loading,
    userPosts,
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
  };
};
