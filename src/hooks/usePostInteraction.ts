import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    toggleLike,
    checkIfLiked,
    toggleRepost,
    checkIfReposted,
} from "@/lib/api";
import { isValidUUID } from "@/lib/utils";
import type { PostStats, User } from "@/types/index";
import { useToast } from "@/context/ToastContext";

export const usePostInteraction = (
    postId: string,
    initialStats: PostStats,
    currentUser: User | null
) => {
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    
    // Local state for immediate UI feedback, synced with React Query data
    const [localStats, setLocalStats] = useState<PostStats>(
        initialStats || { comments: 0, likes: 0, mirrors: 0, reposts: 0 },
    );
... (rest of the replace string remains unchanged) ...
        liked: isLiked,
        reposted: isReposted,
        localStats,
        setLocalStats,
        handleLike,
        handleRepost,
    };
};
