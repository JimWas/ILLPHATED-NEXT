create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_-]{3,24}$'),
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('member', 'moderator', 'admin')),
  is_banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forum_boards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,40}$'),
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '',
  is_private boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.forum_memberships (
  board_id uuid not null references public.forum_boards(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  membership_role text not null default 'member' check (membership_role in ('member', 'publisher', 'moderator')),
  created_at timestamptz not null default now(),
  primary key (board_id, user_id)
);

create table public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.forum_boards(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null check (char_length(title) between 3 and 140),
  slug text not null check (slug ~ '^[a-z0-9-]{1,170}$'),
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  reply_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_post_at timestamptz not null default now(),
  legacy_source text,
  legacy_id text,
  legacy_author_name text,
  unique (board_id, slug),
  unique (legacy_source, legacy_id)
);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null check (char_length(body) between 1 and 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  legacy_source text,
  legacy_id text,
  legacy_author_name text,
  unique (legacy_source, legacy_id)
);

create table public.forum_attachments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  uploader_id uuid references public.profiles(id) on delete set null,
  storage_path text not null unique,
  file_name text not null check (char_length(file_name) between 1 and 255),
  mime_type text,
  size_bytes bigint not null check (size_bytes between 0 and 262144000),
  created_at timestamptz not null default now()
);

create table public.forum_legacy_redirects (
  source_kind text not null check (source_kind in ('forum', 'topic', 'post', 'path')),
  source_id text not null,
  destination_path text not null check (destination_path like '/boards/%'),
  primary key (source_kind, source_id)
);

create index forum_threads_board_activity_idx on public.forum_threads(board_id, is_pinned desc, last_post_at desc);
create index forum_posts_thread_created_idx on public.forum_posts(thread_id, created_at);
create index forum_attachments_post_idx on public.forum_attachments(post_id);

insert into public.forum_boards (slug, title, description, is_private, sort_order) values
  ('b', 'RANDOM', 'SYSTEM_LEVEL_CHAOS', false, 10),
  ('tech', 'TECHNOLOGY', 'HARDWARE_SOFTWARE_OPERATIONS', false, 20),
  ('dev', 'DEVELOPMENT', 'CODE_BUILDS_AUTOMATION_OPEN_SOURCE', false, 30),
  ('ai', 'ARTIFICIAL_INTELLIGENCE', 'MODELS_AGENTS_TOOLS_GENERATIVE_MEDIA', false, 40),
  ('nasa', 'AEROSPACE', 'MISSION_CONTROL_AND_FLIGHT', false, 50),
  ('v', 'VIDEO_GAMES', 'VIRTUAL_SIMULATION_LOGS', false, 60),
  ('meta', 'SITE_OPERATIONS', 'ANNOUNCEMENTS_RULES_FEEDBACK', false, 70),
  ('releases', 'PRIVATE SOFTWARE RELEASES', 'MEMBERS_ONLY_DOWNLOAD_VAULT', true, 100)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  is_private = excluded.is_private,
  sort_order = excluded.sort_order;

create or replace function public.handle_new_forum_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  desired_username text;
begin
  desired_username := regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1), 'member'), '[^A-Za-z0-9_-]', '', 'g');
  if char_length(desired_username) < 3 then desired_username := 'member'; end if;
  desired_username := left(desired_username, 17);
  if exists (select 1 from public.profiles where lower(username) = lower(desired_username)) then
    desired_username := desired_username || '-' || left(replace(new.id::text, '-', ''), 6);
  end if;
  insert into public.profiles (id, username, display_name)
  values (new.id, desired_username, nullif(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_forum_user();

insert into public.profiles (id, username)
select
  user_row.id,
  left(coalesce(nullif(regexp_replace(split_part(user_row.email, '@', 1), '[^A-Za-z0-9_-]', '', 'g'), ''), 'member'), 17)
    || '-' || left(replace(user_row.id::text, '-', ''), 6)
from auth.users user_row
where not exists (select 1 from public.profiles profile where profile.id = user_row.id);

create or replace function public.is_forum_staff(check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = check_user and role in ('moderator', 'admin') and not is_banned
  );
$$;

create or replace function public.has_forum_board_access(check_board uuid, check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.forum_boards board
    where board.id = check_board
      and (
        not board.is_private
        or public.is_forum_staff(check_user)
        or exists (
          select 1 from public.forum_memberships membership
          where membership.board_id = board.id and membership.user_id = check_user
        )
      )
  );
$$;

create or replace function public.can_publish_forum_board(check_board uuid, check_user uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.forum_boards board
    where board.id = check_board
      and (
        not board.is_private
        or public.is_forum_staff(check_user)
        or exists (
          select 1 from public.forum_memberships membership
          where membership.board_id = board.id
            and membership.user_id = check_user
            and membership.membership_role in ('publisher', 'moderator')
        )
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.forum_boards enable row level security;
alter table public.forum_memberships enable row level security;
alter table public.forum_threads enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_attachments enable row level security;
alter table public.forum_legacy_redirects enable row level security;

create policy profiles_read on public.profiles for select using (true);
create policy profiles_update_self on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy boards_read_accessible on public.forum_boards for select using (public.has_forum_board_access(id));
create policy boards_staff_insert on public.forum_boards for insert to authenticated with check (public.is_forum_staff());
create policy boards_staff_update on public.forum_boards for update to authenticated using (public.is_forum_staff()) with check (public.is_forum_staff());
create policy boards_staff_delete on public.forum_boards for delete to authenticated using (public.is_forum_staff());

create policy memberships_read_own_or_staff on public.forum_memberships for select to authenticated using (user_id = auth.uid() or public.is_forum_staff());
create policy memberships_staff_insert on public.forum_memberships for insert to authenticated with check (public.is_forum_staff());
create policy memberships_staff_update on public.forum_memberships for update to authenticated using (public.is_forum_staff()) with check (public.is_forum_staff());
create policy memberships_staff_delete on public.forum_memberships for delete to authenticated using (public.is_forum_staff());

create policy threads_read_accessible on public.forum_threads for select using (public.has_forum_board_access(board_id));
create policy threads_member_insert on public.forum_threads for insert to authenticated with check (
  author_id = auth.uid() and public.can_publish_forum_board(board_id)
  and not exists (select 1 from public.profiles where id = auth.uid() and is_banned)
);
create policy threads_staff_update on public.forum_threads for update to authenticated using (public.is_forum_staff()) with check (public.is_forum_staff());
create policy threads_staff_delete on public.forum_threads for delete to authenticated using (public.is_forum_staff());

create policy posts_read_accessible on public.forum_posts for select using (
  exists (select 1 from public.forum_threads thread where thread.id = thread_id and public.has_forum_board_access(thread.board_id))
);
create policy posts_member_insert on public.forum_posts for insert to authenticated with check (
  author_id = auth.uid()
  and not exists (select 1 from public.profiles where id = auth.uid() and is_banned)
  and exists (
    select 1 from public.forum_threads thread
    where thread.id = thread_id and not thread.is_locked and public.has_forum_board_access(thread.board_id)
  )
);
create policy posts_author_update on public.forum_posts for update to authenticated using (
  author_id = auth.uid() and created_at > now() - interval '30 minutes'
) with check (author_id = auth.uid());
create policy posts_staff_delete on public.forum_posts for delete to authenticated using (public.is_forum_staff());

create policy attachments_read_accessible on public.forum_attachments for select using (
  exists (
    select 1 from public.forum_posts post
    join public.forum_threads thread on thread.id = post.thread_id
    where post.id = post_id and public.has_forum_board_access(thread.board_id)
  )
);
create policy attachments_member_insert on public.forum_attachments for insert to authenticated with check (
  uploader_id = auth.uid()
  and exists (
    select 1 from public.forum_posts post
    join public.forum_threads thread on thread.id = post.thread_id
    where post.id = post_id and public.can_publish_forum_board(thread.board_id)
  )
);
create policy attachments_owner_delete on public.forum_attachments for delete to authenticated using (uploader_id = auth.uid() or public.is_forum_staff());

create policy redirects_public_read on public.forum_legacy_redirects for select using (true);
create policy redirects_staff_write on public.forum_legacy_redirects for all to authenticated using (public.is_forum_staff()) with check (public.is_forum_staff());

revoke update on public.profiles from anon, authenticated;
grant update (username, display_name, avatar_url) on public.profiles to authenticated;
revoke update, delete on public.forum_threads from anon;
revoke update on public.forum_threads from authenticated;
grant update (title, is_pinned, is_locked, updated_at) on public.forum_threads to authenticated;
revoke update, delete on public.forum_posts from anon;
revoke update on public.forum_posts from authenticated;
grant update (body, updated_at) on public.forum_posts to authenticated;

create or replace function public.forum_slugify(input text)
returns text
language sql
immutable
set search_path = ''
as $$
  select trim(both '-' from left(regexp_replace(lower(input), '[^a-z0-9]+', '-', 'g'), 150));
$$;

create or replace function public.create_forum_thread(p_board_id uuid, p_title text, p_body text)
returns table (thread_id uuid, thread_slug text, post_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  new_slug text;
  created_thread_id uuid;
  created_post_id uuid;
begin
  if actor is null then raise exception 'Sign in required'; end if;
  if not public.can_publish_forum_board(p_board_id, actor) then raise exception 'Publisher access required'; end if;
  if (select count(*) from public.forum_posts where author_id = actor and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'Posting too quickly; wait one minute';
  end if;
  if char_length(trim(p_title)) not between 3 and 140 then raise exception 'Title must be 3 to 140 characters'; end if;
  if char_length(trim(p_body)) not between 1 and 20000 then raise exception 'Message must be 1 to 20000 characters'; end if;
  new_slug := coalesce(nullif(public.forum_slugify(p_title), ''), 'topic') || '-' || left(replace(gen_random_uuid()::text, '-', ''), 6);
  insert into public.forum_threads (board_id, author_id, title, slug)
  values (p_board_id, actor, trim(p_title), new_slug)
  returning id into created_thread_id;
  insert into public.forum_posts (thread_id, author_id, body)
  values (created_thread_id, actor, trim(p_body))
  returning id into created_post_id;
  return query select created_thread_id, new_slug, created_post_id;
end;
$$;

create or replace function public.create_forum_reply(p_thread_id uuid, p_body text)
returns table (post_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor uuid := auth.uid();
  target_board uuid;
  target_locked boolean;
  created_post_id uuid;
begin
  if actor is null then raise exception 'Sign in required'; end if;
  select board_id, is_locked into target_board, target_locked from public.forum_threads where id = p_thread_id;
  if target_board is null or not public.has_forum_board_access(target_board, actor) then raise exception 'Topic access denied'; end if;
  if target_locked then raise exception 'Topic is locked'; end if;
  if (select count(*) from public.forum_posts where author_id = actor and created_at > now() - interval '1 minute') >= 5 then
    raise exception 'Posting too quickly; wait one minute';
  end if;
  if char_length(trim(p_body)) not between 1 and 20000 then raise exception 'Message must be 1 to 20000 characters'; end if;
  insert into public.forum_posts (thread_id, author_id, body)
  values (p_thread_id, actor, trim(p_body)) returning id into created_post_id;
  return query select created_post_id;
end;
$$;

create or replace function public.refresh_forum_thread_stats()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  affected_thread uuid := coalesce(new.thread_id, old.thread_id);
begin
  update public.forum_threads
  set reply_count = greatest((select count(*) from public.forum_posts where thread_id = affected_thread) - 1, 0),
      last_post_at = coalesce((select max(created_at) from public.forum_posts where thread_id = affected_thread), created_at),
      updated_at = now()
  where id = affected_thread;
  return coalesce(new, old);
end;
$$;

create trigger forum_posts_refresh_thread
  after insert or delete on public.forum_posts
  for each row execute procedure public.refresh_forum_thread_stats();

insert into storage.buckets (id, name, public, file_size_limit)
values ('forum-files', 'forum-files', false, 262144000)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;

create policy forum_files_read on storage.objects for select using (
  bucket_id = 'forum-files'
  and exists (
    select 1 from public.forum_boards board
    where board.id::text = (storage.foldername(name))[1]
      and public.has_forum_board_access(board.id)
  )
);
create policy forum_files_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'forum-files'
  and exists (
    select 1 from public.forum_boards board
    where board.id::text = (storage.foldername(name))[1]
      and public.can_publish_forum_board(board.id)
  )
);
create policy forum_files_delete on storage.objects for delete to authenticated using (
  bucket_id = 'forum-files' and (owner_id = auth.uid()::text or public.is_forum_staff())
);

do $$
begin
  alter publication supabase_realtime add table public.forum_threads;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.forum_posts;
exception when duplicate_object then null;
end $$;

do $$
begin
  if to_regclass('public.posts') is not null then
    execute $migration$
      insert into public.forum_threads (board_id, title, slug, created_at, updated_at, last_post_at, legacy_source, legacy_id)
      select board.id,
             'Archived transmission #' || legacy.id,
             'archived-transmission-' || legacy.id,
             legacy.created_at,
             legacy.created_at,
             legacy.created_at,
             'supabase_boards_v1',
             legacy.id::text
      from public.posts legacy
      join public.forum_boards board on board.slug = legacy.board
      on conflict (legacy_source, legacy_id) do nothing
    $migration$;
    execute $migration$
      insert into public.forum_posts (thread_id, body, created_at, updated_at, legacy_source, legacy_id)
      select thread.id, legacy.content, legacy.created_at, legacy.created_at, 'supabase_boards_v1', legacy.id::text
      from public.posts legacy
      join public.forum_threads thread on thread.legacy_source = 'supabase_boards_v1' and thread.legacy_id = legacy.id::text
      on conflict (legacy_source, legacy_id) do nothing
    $migration$;
  end if;
end $$;

create or replace function public.grant_forum_admin(p_email text)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare target_user uuid;
begin
  select id into target_user from auth.users where lower(email) = lower(trim(p_email));
  if target_user is null then raise exception 'Create the account first'; end if;
  update public.profiles set role = 'admin' where id = target_user;
  insert into public.forum_memberships (board_id, user_id, membership_role)
  select id, target_user, 'publisher' from public.forum_boards where slug = 'releases'
  on conflict (board_id, user_id) do update set membership_role = excluded.membership_role;
end;
$$;

create or replace function public.grant_private_forum_access(p_email text, p_board_slug text default 'releases')
returns void
language plpgsql
security definer set search_path = ''
as $$
declare target_user uuid; target_board uuid;
begin
  select id into target_user from auth.users where lower(email) = lower(trim(p_email));
  select id into target_board from public.forum_boards where slug = p_board_slug and is_private;
  if target_user is null then raise exception 'Create the account first'; end if;
  if target_board is null then raise exception 'Private board not found'; end if;
  insert into public.forum_memberships (board_id, user_id) values (target_board, target_user)
  on conflict (board_id, user_id) do nothing;
end;
$$;

create or replace function public.admin_grant_private_forum_access(p_email text, p_board_slug text default 'releases')
returns void
language plpgsql
security definer set search_path = ''
as $$
declare target_user uuid; target_board uuid;
begin
  if not public.is_forum_staff(auth.uid()) then raise exception 'Administrator access required'; end if;
  select id into target_user from auth.users where lower(email) = lower(trim(p_email));
  select id into target_board from public.forum_boards where slug = p_board_slug and is_private;
  if target_user is null then raise exception 'Member must create an account first'; end if;
  if target_board is null then raise exception 'Private board not found'; end if;
  insert into public.forum_memberships (board_id, user_id) values (target_board, target_user)
  on conflict (board_id, user_id) do nothing;
end;
$$;

revoke all on function public.grant_forum_admin(text) from public, anon, authenticated;
revoke all on function public.grant_private_forum_access(text, text) from public, anon, authenticated;
revoke all on function public.admin_grant_private_forum_access(text, text) from public, anon;
revoke all on function public.create_forum_thread(uuid, text, text) from public, anon;
revoke all on function public.create_forum_reply(uuid, text) from public, anon;
grant execute on function public.create_forum_thread(uuid, text, text) to authenticated;
grant execute on function public.create_forum_reply(uuid, text) to authenticated;
grant execute on function public.admin_grant_private_forum_access(text, text) to authenticated;
