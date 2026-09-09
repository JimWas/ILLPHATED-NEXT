export type ForumBoard = {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_private: boolean;
  sort_order: number;
};

export type ForumThreadSummary = {
  id: string;
  slug: string;
  title: string;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  created_at: string;
  last_post_at: string;
  author: { username: string } | null;
  legacy_author_name?: string | null;
};

export type ForumPost = {
  id: string;
  body: string;
  created_at: string;
  updated_at: string;
  author: { username: string } | null;
  legacy_author_name?: string | null;
  attachments: ForumAttachment[];
};

export type ForumAttachment = {
  id: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number;
  storage_path: string;
};

export const FALLBACK_BOARDS: ForumBoard[] = [
  { id: "", slug: "b", title: "RANDOM", description: "SYSTEM_LEVEL_CHAOS", is_private: false, sort_order: 10 },
  { id: "", slug: "tech", title: "TECHNOLOGY", description: "HARDWARE_SOFTWARE_OPERATIONS", is_private: false, sort_order: 20 },
  { id: "", slug: "nasa", title: "AEROSPACE", description: "MISSION_CONTROL_AND_FLIGHT", is_private: false, sort_order: 30 },
  { id: "", slug: "v", title: "VIDEO_GAMES", description: "VIRTUAL_SIMULATION_LOGS", is_private: false, sort_order: 40 },
  { id: "", slug: "releases", title: "PRIVATE SOFTWARE RELEASES", description: "MEMBERS_ONLY_DOWNLOAD_VAULT", is_private: true, sort_order: 100 },
];

export function formatForumDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function forumIsConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
