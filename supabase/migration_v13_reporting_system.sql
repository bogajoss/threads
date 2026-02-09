-- Migration V13: Reporting System
-- Create a centralized table for all user reports

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'reel', 'user', 'community')),
    target_id UUID NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create reports" ON public.reports 
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view and manage reports" ON public.reports 
    FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'moderator')
        )
    );

-- Add 'report' to notification types if needed (optional but good for tracking)
-- ALTER TYPE notification_type ADD VALUE 'report';
