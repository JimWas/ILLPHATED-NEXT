import { supabase } from "@/lib/supabase";

export type Story = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  audio_url: string | null;
  images: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export function isStoryVideo(url: string): boolean {
  return /\.mp4(?:$|[?#])/i.test(url);
}

export async function getFeaturedStory(): Promise<Story | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const { data } = await supabase
    .from("stories")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as Story | null;
}

export async function getPublishedStories(): Promise<Story[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const { data } = await supabase
    .from("stories")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as Story[];
}

export async function getLatestStories(limit = 3): Promise<Story[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const { data } = await supabase
    .from("stories")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Story[];
}

export async function getStory(slug: string): Promise<Story | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const { data } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data as Story | null;
}
