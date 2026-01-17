-- Required for NextAuth Magic Links (Email Provider)
create table if not exists public.verification_tokens (
  identifier text not null,
  token text not null,
  expires timestamp with time zone not null,
  primary key (identifier, token)
);

-- Enable RLS (optional but good practice)
alter table public.verification_tokens enable row level security;

-- Allow public access (NextAuth handles security via the token itself)
create policy "Public can manage verification tokens" on public.verification_tokens
  for all
  using (true);
