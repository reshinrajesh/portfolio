-- Run this in Supabase SQL Editor to fix the missing column

ALTER TABLE public.authenticators 
ADD COLUMN IF NOT EXISTS credentialBackedUp boolean not null default false;

-- If you get "column already exists", ignore it.
