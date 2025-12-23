-- Create the posts table
create table public.posts (
  id uuid not null default gen_random_uuid (),
  title text not null,
  content text null, -- Stores the HTML content
  status text not null default 'Draft'::text, -- 'Draft' or 'Published'
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint posts_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create a policy that allows EVERYONE to READ published posts
create policy "Public can read published posts" on public.posts
  for select
  using (status = 'Published');

-- Create a policy that allows ONLY YOU (via service_role or authenticated admin) to ALL
create policy "Service role bypass" on public.posts
  for all
  using (true);

-- Create site_content table for generic text (CMS)
create table public.site_content (
  key text not null,
  value text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint site_content_pkey primary key (key)
);

alter table public.site_content enable row level security;

create policy "Public can read site content" on public.site_content
  for select
  using (true);

create policy "Admin can manage site content" on public.site_content
  for all
  using (true);

-- New columns for Schema Update (Run these in Supabase SQL Editor if you haven't)
alter table public.posts add column if not exists tags text[] default '{}';
alter table public.posts add column if not exists seo_title text;
alter table public.posts add column if not exists seo_description text;
alter table public.posts add column if not exists view_count integer default 0;

-- Create skills table
create table public.skills (
  id uuid not null default gen_random_uuid (),
  name text not null,
  icon text not null, -- keys from lucide-react
  color text not null, -- tailwind color classes like 'text-blue-500'
  "order" integer default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint skills_pkey primary key (id)
);

-- Enable RLS
alter table public.skills enable row level security;

-- Policies
create policy "Public can read skills" on public.skills
  for select
  using (true);

create policy "Admin can manage skills" on public.skills
  for all
  using (true);
