import { supabase } from "@/lib/supabase";

export type ReportTargetType = "post" | "reel" | "user" | "community";

export const reportsApi = {
  async createReport(
    reporterId: string,
    targetType: ReportTargetType,
    targetId: string,
    reason?: string,
  ) {
    const { data, error } = await (supabase.from("reports") as any)
      .insert([
        {
          reporter_id: reporterId,
          target_type: targetType,
          target_id: targetId,
          reason,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
