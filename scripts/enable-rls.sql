-- Row Level Security for every table in the public schema.
--
-- Before this ran, RLS was disabled everywhere, which means PostgREST honoured
-- the anon key for both reads and writes on all 13 tables. The anon key is
-- public by construction: it is NEXT_PUBLIC_*, it ships inside the client
-- bundle, and anyone can read it out of the page source. So the position was:
--
--   * any visitor could rewrite or delete projects, posts, skills, the resume
--     tables and site_content;
--   * any visitor could READ verification_tokens, which is the magic-link
--     table. A pending token there is enough to sign in as the admin.
--
-- The shape of the fix:
--
--   Public content   anon may SELECT. Nothing else. Writes arrive through the
--                    service role, which bypasses RLS entirely.
--   Auth + logs      no anon policy at all, so RLS denies everything. Only the
--                    service role touches these, and it is unaffected.
--
-- The service role bypasses RLS by design, so every server-side path that uses
-- supabaseAdmin keeps working. Code that wrote with the anon client has been
-- moved onto supabaseAdmin; anything still using the anon key to write will
-- start failing here, which is the intended outcome.
--
-- Safe to re-run: every policy is dropped before it is created.

begin;

-- ---------------------------------------------------------------------------
-- 1. Public content: readable by anyone, writable by no one but the service role
-- ---------------------------------------------------------------------------

do $$
declare
    t text;
begin
    foreach t in array array[
        'projects',
        'posts',
        'skills',
        'resume_work',
        'resume_education',
        'site_content',
        'albums',
        'gallery_images',
        'status_incidents'
    ]
    loop
        execute format('alter table public.%I enable row level security', t);

        -- `force` also applies RLS to the table owner. Without it, a connection
        -- that happens to authenticate as the owner silently skips every policy
        -- below, which is exactly the hole this migration exists to close.
        execute format('alter table public.%I force row level security', t);

        execute format('drop policy if exists %I on public.%I', t || '_anon_select', t);
        execute format(
            'create policy %I on public.%I for select to anon, authenticated using (true)',
            t || '_anon_select', t
        );
    end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- 2. Auth and logs: no policy, therefore no access for anon or authenticated
-- ---------------------------------------------------------------------------
--
-- Deliberately left with zero policies. RLS denies by default, so this blocks
-- the anon key completely while leaving the service role untouched. These
-- tables are only ever read or written by server-side code holding the service
-- key: NextAuth, the passkey routes, and the magic-link sender.

do $$
declare
    t text;
begin
    foreach t in array array[
        'users',
        'authenticators',
        'verification_tokens',
        'access_logs'
    ]
    loop
        execute format('alter table public.%I enable row level security', t);
        execute format('alter table public.%I force row level security', t);

        -- Drop any permissive policy that may already exist on these.
        execute format('drop policy if exists %I on public.%I', t || '_anon_select', t);
        execute format('drop policy if exists %I on public.%I', t || '_anon_all', t);
    end loop;
end
$$;

commit;

-- ---------------------------------------------------------------------------
-- Verification
-- ---------------------------------------------------------------------------
-- Expect rls_enabled = true for all 13 rows, one policy on each of the nine
-- content tables, and zero policies on the four auth tables.

select
    c.relname                                as table_name,
    c.relrowsecurity                         as rls_enabled,
    c.relforcerowsecurity                    as rls_forced,
    coalesce(p.policy_count, 0)              as policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join (
    select polrelid, count(*) as policy_count
    from pg_policy
    group by polrelid
) p on p.polrelid = c.oid
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;
