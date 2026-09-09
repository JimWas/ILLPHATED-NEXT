-- Add the expanded public forum catalog without disturbing existing boards,
-- threads, memberships, or the private software release area.
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
