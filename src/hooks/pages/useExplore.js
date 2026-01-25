import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchCommunities } from "@/lib/api";

export const useExplore = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [communitiesData, setCommunitiesData] = useState([]);
  const [isCommunitiesLoading, setIsCommunitiesLoading] = useState(true);
  const [isFetchingMoreCommunities, setIsFetchingMoreCommunities] = useState(false);
  const [hasMoreCommunities, setHasMoreCommunities] = useState(true);
  
  const communitiesRef = useRef(communitiesData);

  useEffect(() => {
    communitiesRef.current = communitiesData;
  }, [communitiesData]);

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

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

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

  return {
    currentUser,
    searchQuery,
    setSearchQuery,
    isCreateModalOpen,
    setIsCreateModalOpen,
    communitiesData,
    isCommunitiesLoading,
    isFetchingMoreCommunities,
    hasMoreCommunities,
    filteredCommunities,
    handleCommunityClick,
    loadCommunities,
    navigate
  };
};
