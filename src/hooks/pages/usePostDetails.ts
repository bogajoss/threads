import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
// @ts-ignore
import { fetchPostById } from "@/lib/api"
import { isValidUUID } from "@/lib/utils"

export const usePostDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { currentUser } = useAuth()
    const { addToast } = useToast()

    const {
        data: post,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["post", id],
        queryFn: async () => {
            if (!id || !isValidUUID(id)) {
                throw new Error("Invalid post ID")
            }
            return fetchPostById(id)
        },
        enabled: !!id,
        retry: false,
    })

    const handleUserClick = (handle: string) => {
        navigate(`/u/${handle}`)
    }

    const handleDelete = () => {
        navigate(-1)
    }

    return {
        post,
        isLoading,
        isError,
        currentUser,
        addToast,
        navigate,
        handleUserClick,
        handleDelete,
    }
}
