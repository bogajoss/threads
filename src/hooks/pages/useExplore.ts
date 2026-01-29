import { useState, useEffect, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)
    const initialSearch = queryParams.get("q") || ""
    const initialTab =
        queryParams.get("tab") || (initialSearch ? "posts" : "communities")

    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [activeTab, setActiveTab] = useState(initialTab)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    // Sync state if URL changes (like clicking a new hashtag)
    useEffect(() => {
        if (initialSearch !== searchQuery) {
            setSearchQuery(initialSearch)
            if (initialSearch) setActiveTab("posts")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSearch])

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
        setSearchQuery(val)
    }

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
        loadCommunities: fetchNextCommunities,
        loadPosts: fetchNextPosts,
        navigate,
    }
}
