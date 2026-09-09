-- Run only after the full forum UI is serving production traffic.
do $$
begin
  if to_regclass('public.posts') is not null and to_regclass('public.posts_legacy_v1') is null then
    execute 'drop policy if exists "Allow public read access" on public.posts';
    execute 'drop policy if exists "Allow anonymous insert access" on public.posts';
    execute 'revoke all on public.posts from anon, authenticated';
    execute 'alter table public.posts rename to posts_legacy_v1';
  end if;
end $$;
