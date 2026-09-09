import { createClient } from "@supabase/supabase-js";

function fallback(request: Request) {
  return Response.redirect(new URL("/boards", request.url), 308);
}

export async function redirectLegacyForumRequest(request: Request, sourceKind: "forum" | "topic" | "post", sourceId: string | null) {
  if (!sourceId || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallback(request);
  }
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
  const { data } = await client
    .from("forum_legacy_redirects")
    .select("destination_path")
    .eq("source_kind", sourceKind)
    .eq("source_id", sourceId)
    .maybeSingle();
  if (data?.destination_path) return Response.redirect(new URL(data.destination_path, request.url), 308);

  if (sourceKind === "topic") {
    const { data: thread } = await client
      .from("forum_threads")
      .select("slug, board:forum_boards!forum_threads_board_id_fkey(slug)")
      .eq("legacy_id", sourceId)
      .maybeSingle();
    const joinedBoard = thread?.board as unknown as { slug?: string } | null;
    if (thread?.slug && joinedBoard?.slug) {
      return Response.redirect(new URL(`/boards/${joinedBoard.slug}/${thread.slug}`, request.url), 308);
    }
  }
  return fallback(request);
}
