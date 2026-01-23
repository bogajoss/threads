import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Post from "@/components/features/post/Post";
import ProfileCard from "@/components/ui/ProfileCard";
import SkeletonPost from "@/components/ui/SkeletonPost";
import SearchBar from "@/components/ui/SearchBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchPosts, fetchProfiles } from "@/services/api";

const Explore = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const { data: profiles = {}, isLoading: isProfilesLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });

  const users = useMemo(() => {
    let list = Object.values(profiles).filter((p) => p.type !== "community");
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
    let list = Object.values(profiles).filter((p) => p.type === "community");
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
          </div>
        </TabsContent>

        <TabsContent value="reels" className="m-0 border-none">
          <div>
            {reels.length > 0 ? (
              reels.map((post) => (
                <Post
                  key={post.id}
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
