-- Case-study fields for the projects table.
--
-- Run in the Supabase SQL editor. Every column is nullable and additive, so
-- existing rows keep working and /projects/[slug] degrades to the short form
-- until they are filled in.

alter table public.projects
    add column if not exists summary     text,        -- one line under the title
    add column if not exists role        text,        -- "Solo build", "Frontend", ...
    add column if not exists year        text,        -- "2025", "2024-2025"
    add column if not exists status      text,        -- "Shipped", "Archived", "In progress"
    add column if not exists problem     text,        -- what needed solving
    add column if not exists approach    text,        -- how it was built
    add column if not exists outcome     text,        -- what came of it
    add column if not exists highlights  text[],      -- short result bullets
    add column if not exists content     text,        -- optional long-form HTML
    add column if not exists gallery     text[];      -- extra screenshot URLs

-- problem / approach / outcome are plain text. Blank lines separate paragraphs.
-- `content` is rendered as HTML, so only ever write trusted markup into it.

comment on column public.projects.summary is 'Short lead paragraph shown under the case-study title.';
comment on column public.projects.highlights is 'Short outcome bullets, e.g. "Cut cold start from 4s to 900ms".';
comment on column public.projects.content is 'Optional long-form HTML. Rendered with dangerouslySetInnerHTML - trusted input only.';
