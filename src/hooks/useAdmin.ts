import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";

export const useAdmin = () => {
  const queryClient = useQueryClient();

  // Queries
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.getSystemStats(),
  });

  const users = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.getAllUsers(),
  });

  const posts = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: () => adminApi.getLatestPosts(),
  });

  const reports = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: () => adminApi.getReports(),
  });

  const analytics = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => adminApi.getAnalytics(),
  });

  const settings = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminApi.getSettings(),
  });

  // Mutations
  const updateSettings = useMutation({
    mutationFn: (newSettings: any) => adminApi.updateSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings updated");
    },
    onError: () => toast.error("Failed to update settings")
  });

  const updateRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: any }) => 
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated");
    },
    onError: () => toast.error("Failed to update role")
  });

  const toggleVerification = useMutation({
    mutationFn: ({ userId, verified }: { userId: string; verified: boolean }) => 
      adminApi.toggleUserVerification(userId, verified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Verification status updated");
    },
    onError: () => toast.error("Failed to update verification")
  });

  const toggleBan = useMutation({
    mutationFn: ({ userId, banned }: { userId: string; banned: boolean }) => 
      adminApi.toggleUserBan(userId, banned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User ban status updated");
    },
    onError: () => toast.error("Failed to update ban status")
  });

  const deletePost = useMutation({
    mutationFn: (postId: string) => adminApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      toast.success("Post deleted permanently");
    },
    onError: () => toast.error("Failed to delete post")
  });

  const updateReportStatus = useMutation({
    mutationFn: ({ reportId, status }: { reportId: string, status: any }) => 
      adminApi.updateReportStatus(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] });
      toast.success("Report status updated");
    },
    onError: () => toast.error("Failed to update report")
  });

  const deleteTarget = useMutation({
    mutationFn: ({ type, id }: { type: string, id: string }) => 
      adminApi.deleteReportTarget(type, id),
    onSuccess: () => {
      toast.success("Content removed successfully");
    },
    onError: () => toast.error("Failed to remove content")
  });

  return {
    stats: {
      data: stats.data,
      isLoading: stats.isLoading
    },
    users: {
      data: users.data,
      isLoading: users.isLoading
    },
    posts: {
      data: posts.data,
      isLoading: posts.isLoading
    },
    reports: {
      data: reports.data,
      isLoading: reports.isLoading
    },
    analytics: {
      data: analytics.data,
      isLoading: analytics.isLoading
    },
    settings: {
      data: settings.data,
      isLoading: settings.isLoading
    },
    actions: {
      updateRole: updateRole.mutate,
      toggleVerification: toggleVerification.mutate,
      toggleBan: toggleBan.mutate,
      deletePost: deletePost.mutate,
      updateSettings: updateSettings.mutate,
      updateReportStatus: updateReportStatus.mutate,
      deleteTarget: deleteTarget.mutate
    }
  };
};
