
-- Delete all profiles and user_roles first
DELETE FROM public.user_roles;
DELETE FROM public.profiles;
DELETE FROM public.orders;

-- Delete all auth users
DELETE FROM auth.users;
