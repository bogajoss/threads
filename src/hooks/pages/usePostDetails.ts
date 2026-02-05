import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { fetchPostById } from "@/lib/api";
import { isValidUUID } from "@/lib/utils";

export const usePostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id || !isValidUUID(id)) {
        throw new Error("Invalid post ID");
      }
      return fetchPostById(id);
    },
    enabled: !!id,
    retry: false,
  });

  const handleUserClick = (handle: string) => {
    navigate(`/u/${handle}`);
  };

  const handleDelete = () => {
    navigate(-1);
  };

  const handleUpdate = (id: string, content: string, media: any[]) => {
    queryClient.setQueryData(["post", id], (old: any) => {
      if (!old) return old;
      return { ...old, content, media };
    });
  };

  return {
    post,
    isLoading,
    isError,
    currentUser,
    addToast,
    navigate,
    handleUserClick,
    handleDelete,
    handleUpdate,
  };
};
