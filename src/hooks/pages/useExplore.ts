import { useState, useMemo } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
// @ts-ignore
import {
    fetchCommunities,
    searchPosts,
    fetchCommunityExplorePosts,
} from "@/lib/api"

export const useExplore = () => {
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const searchQuery = searchParams.get("q") || ""
    const activeTab = searchParams.get("tab") || (searchQuery ? "posts" : "communities")
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    // 1. Communities Data using useInfiniteQuery
    const {
        data: communitiesInfiniteData,
        fetchNextPage: fetchNextCommunities,
        hasNextPage: hasMoreCommunities,
        isFetchingNextPage: isFetchingMoreCommunities,
        isLoading: isCommunitiesLoading
    } = useInfiniteQuery({
        queryKey: ["explore", "communities"],
        queryFn: ({ pageParam }) => fetchCommunities(pageParam, 10),
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 10) return undefined;
            return lastPage[lastPage.length - 1].createdAt;
        }
    });

    const communitiesData = useMemo(() => {
        return communitiesInfiniteData?.pages.flatMap(page => page) || [];
    }, [communitiesInfiniteData]);

    // 2. Posts Data using useInfiniteQuery
    const {
        data: postsInfiniteData,
        fetchNextPage: fetchNextPosts,
        hasNextPage: hasMorePosts,
        isFetchingNextPage: isFetchingMorePosts,
        isLoading: isPostsLoading
    } = useInfiniteQuery({
        queryKey: ["explore", "posts", searchQuery],
        queryFn: ({ pageParam }) => {
            if (searchQuery) {
                return searchPosts(searchQuery, pageParam, 10, true);
            }
            return fetchCommunityExplorePosts(pageParam, 10);
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length < 10) return undefined;
            return lastPage[lastPage.length - 1].sort_timestamp || lastPage[lastPage.length - 1].sortTimestamp;
        }
    });

    const postsData = useMemo(() => {
        return postsInfiniteData?.pages.flatMap(page => page) || [];
    }, [postsInfiniteData]);

    // Note: Ideally, community search should also be server-side. 
    // For now, keeping client-side filtering as per original logic but can be moved to API.
    const filteredCommunities = useMemo(() => {
        let list = communitiesData
        if (searchQuery) {
            list = list.filter(
                (c) =>
                    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.handle?.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }
        return list
    }, [communitiesData, searchQuery])

    const handleCommunityClick = (handle: string) => {
        navigate(`/c/${handle}`)
    }

    const handleSearchChange = (val: string) => {
        setSearchParams(prev => {
            if (val) prev.set("q", val)
            else prev.delete("q")
            return prev
        }, { replace: true })
    }

    const handleTabChange = (val: string) => {
        setSearchParams(prev => {
            prev.set("tab", val)
            return prev
        }, { replace: true })
    }

    return {
        currentUser,
        searchQuery,
        setSearchQuery: handleSearchChange,
        activeTab,
        setActiveTab: handleTabChange,
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
        loadCommunities: fetchNextCommunities,
        loadPosts: fetchNextPosts,
        navigate,
    }
}
