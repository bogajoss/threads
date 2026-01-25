import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Post from "@/components/features/post/Post";
import ProfileCard from "@/components/ui/ProfileCard";
import SkeletonPost from "@/components/ui/SkeletonPost";
import SearchBar from "@/components/ui/SearchBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/context/ToastContext";
import { fetchProfiles } from "@/lib/api";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

const Explore = () => {
  const { currentUser } = useAuth();
  const { posts, loading: isPostsLoading } = usePosts();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [isProfilesLoading, setIsProfilesLoading] = useState(true);
  const [isFetchingMoreProfiles, setIsFetchingMoreProfiles] = useState(false);
  const [hasMoreProfiles, setHasMoreProfiles] = useState(true);
  const profilesRef = useRef(profiles);

  useEffect(() => {
    profilesRef.current = profiles;
  }, [profiles]);

  const loadProfiles = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setIsFetchingMoreProfiles(true);
    else setIsProfilesLoading(true);

    try {
      const currentProfiles = profilesRef.current;
      const lastTimestamp = isLoadMore && currentProfiles.length > 0
        ? currentProfiles[currentProfiles.length - 1].created_at
        : null;

      const data = await fetchProfiles(lastTimestamp, 10);
      
      if (data.length < 10) setHasMoreProfiles(false);
      else setHasMoreProfiles(true);

      if (isLoadMore) {
        setProfiles(prev => [...prev, ...data]);
      } else {
        setProfiles(data);
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setIsProfilesLoading(false);
      setIsFetchingMoreProfiles(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const users = useMemo(() => {
    let list = profiles.filter((p) => p.type !== "community");
    if (searchQuery) {
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.handle?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [profiles, searchQuery]);

  const communities = useMemo(() => {
    let list = profiles.filter((p) => p.type === "community");
    if (searchQuery) {
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.handle?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [profiles, searchQuery]);

  const reels = useMemo(() => {
    let list = posts.filter((post) => post.type === "video");
    if (searchQuery) {
      list = list.filter((p) =>
        p.content?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return list;
  }, [posts, searchQuery]);

  const handlePostClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleUserClick = (handle) => {
    navigate(`/u/${handle}`);
  };

  const isLoading = isPostsLoading || isProfilesLoading;

  if (isLoading) {
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-md z-10 border-b border-zinc-100 dark:border-zinc-800">
          <div className="p-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder={`Search ${activeTab}...`}
            />
          </div>
          <TabsList className="w-full h-auto bg-transparent p-0 rounded-none justify-around px-5">
            {["users", "communities", "reels"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative py-4 px-2 text-sm font-semibold transition-all border-b-2 rounded-none whitespace-nowrap flex-1 text-center capitalize data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:text-black dark:data-[state=active]:text-white text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="users" className="m-0 border-none">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {users.length > 0 ? (
              users.map((user) => (
                <ProfileCard
                  key={user.handle}
                  profile={user}
                  onUserClick={handleUserClick}
                />
              ))
            ) : (
              <div className="p-20 text-center text-zinc-500">
                <p className="font-bold">No users found</p>
              </div>
            )}
            
            {hasMoreProfiles && users.length > 0 && (
              <div className="p-6 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  variant="secondary"
                  className="w-full max-w-xs"
                  onClick={() => loadProfiles(true)}
                  disabled={isFetchingMoreProfiles}
                >
                  {isFetchingMoreProfiles && <Loader2 size={18} className="animate-spin mr-2" />}
                  Load more
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="communities" className="m-0 border-none">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {communities.length > 0 ? (
              communities.map((community) => (
                <ProfileCard
                  key={community.handle}
                  profile={community}
                  onUserClick={handleUserClick}
                  isCommunity={true}
                />
              ))
            ) : (
              <div className="p-20 text-center text-zinc-500">
                <p className="font-bold">No communities found</p>
              </div>
            )}

            {hasMoreProfiles && communities.length > 0 && (
              <div className="p-6 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  variant="secondary"
                  className="w-full max-w-xs"
                  onClick={() => loadProfiles(true)}
                  disabled={isFetchingMoreProfiles}
                >
                  {isFetchingMoreProfiles && <Loader2 size={18} className="animate-spin mr-2" />}
                  Load more
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reels" className="m-0 border-none">
          <div>
            {reels.length > 0 ? (
              reels.map((post) => (
                <Post
                  key={post.feed_id || post.id}
                  {...post}
                  currentUser={currentUser}
                  showToast={addToast}
                  onClick={() => handlePostClick(post.id)}
                  onUserClick={handleUserClick}
                />
              ))
            ) : (
              <div className="p-20 text-center text-zinc-500">
                <p className="font-bold">No reels found</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
