import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "@/components/ui/ProfileCard";
import SkeletonPost from "@/components/ui/SkeletonPost";
import SearchBar from "@/components/ui/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { fetchCommunities } from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import CreateCommunityModal from "@/components/features/modals/CreateCommunityModal";

const Explore = () => {
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

  if (isCommunitiesLoading && !communitiesData.length) {
    return (
      <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen">
        {[1, 2, 3].map((i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="border-y md:border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black rounded-none md:rounded-xl overflow-hidden min-h-screen shadow-sm">
      <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800">
        <div className="p-4 flex gap-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search communities..."
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
        <div className="px-5 py-2 border-t border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold dark:text-white">Communities</h2>
          <p className="text-xs text-zinc-500">Discover and join interest-based groups</p>
        </div>
      </div>

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

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default Explore;
