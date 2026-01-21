-- Trigger to automatically create a profile in the 'users' table when a new user signs up via Supabase Auth
-- This ensures data consistency even if the frontend call fails.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name, avatar_url, is_verified)
  VALUES (
    new.id,
    new.email,
    SPLIT_PART(new.email, '@', 1), -- Default username from email
    SPLIT_PART(new.email, '@', 1), -- Default display name from email
    'https://static.hey.xyz/images/brands/lens.svg',
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
