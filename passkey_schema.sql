-- Create users table for WebAuthn challenge tracking
create table public.users (
  id uuid not null default gen_random_uuid (),
  email text not null unique,
  current_challenge text null,
  created_at timestamp with time zone not null default now(),
  constraint users_pkey primary key (id)
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Admin can manage users" on public.users
  for all
  using (true);

-- Create authenticators table for storing Passkeys
create table public.authenticators (
  credentialID text not null,
  credentialPublicKey text not null,
  counter integer not null default 0,
  credentialDeviceType text not null,
  credentialBackedUp boolean not null default false,
  transports text null,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  last_used_at timestamp with time zone not null default now(),
  constraint authenticators_pkey primary key (credentialID)
);

-- Enable RLS
alter table public.authenticators enable row level security;

-- Policies for authenticators
create policy "Admin can manage authenticators" on public.authenticators
  for all
  using (true);
