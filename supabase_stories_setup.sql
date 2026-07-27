-- Run this once in the Supabase SQL editor. Disable public sign-ups in
-- Authentication settings so only accounts you create can enter the studio.
create extension if not exists "pgcrypto";

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  body text not null default '',
  cover_url text,
  audio_url text,
  images jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stories enable row level security;

drop policy if exists "Published stories are public" on public.stories;
create policy "Published stories are public" on public.stories
  for select using (published or auth.uid() is not null);

drop policy if exists "Signed in authors can add stories" on public.stories;
create policy "Signed in authors can add stories" on public.stories
  for insert to authenticated with check (true);

drop policy if exists "Signed in authors can update stories" on public.stories;
create policy "Signed in authors can update stories" on public.stories
  for update to authenticated using (true) with check (true);

drop policy if exists "Signed in authors can delete stories" on public.stories;
create policy "Signed in authors can delete stories" on public.stories
  for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('story-media', 'story-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Story media is public" on storage.objects;
create policy "Story media is public" on storage.objects
  for select using (bucket_id = 'story-media');

drop policy if exists "Authors can upload story media" on storage.objects;
create policy "Authors can upload story media" on storage.objects
  for insert to authenticated with check (bucket_id = 'story-media');

drop policy if exists "Authors can update story media" on storage.objects;
create policy "Authors can update story media" on storage.objects
  for update to authenticated using (bucket_id = 'story-media');

drop policy if exists "Authors can delete story media" on storage.objects;
create policy "Authors can delete story media" on storage.objects
  for delete to authenticated using (bucket_id = 'story-media');
