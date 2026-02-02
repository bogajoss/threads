import { useMemo } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
...
    const followList = useMemo(() => {
        return data?.pages.flatMap((page) => page) || []
    }, [data])

    return {
        followList,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    }
}
