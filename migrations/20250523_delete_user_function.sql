
-- Create function to allow users to delete their own account
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  user_id := auth.uid();
  
  -- Delete the user's profile first (cascade delete will handle related data)
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Delete the user from auth schema
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Give the authenticated users permission to execute this function
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
