import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchCommunities, searchPosts, fetchCommunityExplorePosts } from "@/lib/api";

export const useExplore = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('q') || "";
  const initialTab = queryParams.get('tab') || (initialSearch ? "posts" : "communities");

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 1. Communities Data
  const [communitiesData, setCommunitiesData] = useState([]);
  const [isCommunitiesLoading, setIsCommunitiesLoading] = useState(true);
  const [isFetchingMoreCommunities, setIsFetchingMoreCommunities] = useState(false);
  const [hasMoreCommunities, setHasMoreCommunities] = useState(true);
  const communitiesRef = useRef(communitiesData);

  // 2. Posts Data (Search results)
  const [postsData, setPostsData] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isFetchingMorePosts, setIsFetchingMorePosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const postsRef = useRef(postsData);

  useEffect(() => {
    communitiesRef.current = communitiesData;
  }, [communitiesData]);

  useEffect(() => {
    postsRef.current = postsData;
  }, [postsData]);

  // Sync state if URL changes (like clicking a new hashtag)
  useEffect(() => {
    if (initialSearch !== searchQuery) {
      setSearchQuery(initialSearch);
      if (initialSearch) setActiveTab("posts");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch]);

  const loadCommunities = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setIsFetchingMoreCommunities(true);
    else setIsCommunitiesLoading(true);

    try {
      const currentCommunities = communitiesRef.current;
      const lastTimestamp = isLoadMore && currentCommunities.length > 0
        ? currentCommunities[currentCommunities.length - 1].createdAt
        : null;

      const data = await fetchCommunities(lastTimestamp, 10);

      if (data.length < 10) setHasMoreCommunities(false);
      else setHasMoreCommunities(true);

      if (isLoadMore) {
        setCommunitiesData(prev => [...prev, ...data]);
      } else {
        setCommunitiesData(data);
      }
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    } finally {
      setIsCommunitiesLoading(false);
      setIsFetchingMoreCommunities(false);
    }
  }, []);

  const loadPosts = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setIsFetchingMorePosts(true);
    else setIsPostsLoading(true);

    try {
      const currentPosts = postsRef.current;
      const lastTimestamp = isLoadMore && currentPosts.length > 0
        ? currentPosts[currentPosts.length - 1].sort_timestamp || currentPosts[currentPosts.length - 1].sortTimestamp
        : null;

      let data;
      if (searchQuery) {
        data = await searchPosts(searchQuery, lastTimestamp, 10, true);
      } else {
        // Fetch only community posts
        data = await fetchCommunityExplorePosts(lastTimestamp, 10);
      }

      if (data.length < 10) setHasMorePosts(false);
      else setHasMorePosts(true);

      if (isLoadMore) {
        setPostsData(prev => [...prev, ...data]);
      } else {
        setPostsData(data);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsPostsLoading(false);
      setIsFetchingMorePosts(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  useEffect(() => {
    loadPosts();
  }, [searchQuery, loadPosts]);

  const filteredCommunities = useMemo(() => {
    let list = communitiesData;
    if (searchQuery) {
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.handle?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [communitiesData, searchQuery]);

  const handleCommunityClick = (handle) => {
    navigate(`/c/${handle}`);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    // When manually typing, maybe stay on active tab
  };

  return {
    currentUser,
    searchQuery,
    setSearchQuery: handleSearchChange,
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
  };
};
