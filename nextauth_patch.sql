-- Add missing columns required by NextAuth Supabase Adapter
alter table public.users 
add column if not exists "name" text,
add column if not exists "emailVerified" timestamp with time zone,
add column if not exists "image" text;

-- Fix: NextAuth uses "emailVerified" (camelCase) usually, but Postgres might force lowercase. 
-- The adapter maps it. Let's ensure strict quoting if needed, but standard Adapter behavior 
-- usually expects the column names to match the model. 
-- Standard NextAuth schema for Postgres usually uses snake_case in DB but maps to camelCase in JS.
-- However, SupabaseAdapter default (if using the new one) might use "emailVerified".
-- To be safe, I'm adding it as "emailVerified" (quoted) to preserve case if the adapter expects it.

-- ALSO, check if `accounts` and `sessions` tables are needed. 
-- Email login technically doesn't need `accounts` (that's for OAuth), 
-- but it DOES need `sessions` if using Database sessions. 
-- We are using JWT (`strategy: 'jwt'`), so we might get away without `sessions` table.
-- But `emailVerified` is definitely updated on the User object.

-- Safely add columns:
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name') THEN
        ALTER TABLE public.users ADD COLUMN "name" text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emailVerified') THEN
        ALTER TABLE public.users ADD COLUMN "emailVerified" timestamp with time zone;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='image') THEN
        ALTER TABLE public.users ADD COLUMN "image" text;
    END IF;
END
$$;