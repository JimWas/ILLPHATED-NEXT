"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createForumImageUrls, isImageAttachment } from "@/lib/forum-attachments";
import { FALLBACK_BOARDS, formatForumDate, forumIsConfigured, type ForumAttachment, type ForumBoard, type ForumThreadSummary } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

type CreatedThread = { thread_id: string; thread_slug: string; post_id: string };

export default function ForumBoardView({ boardSlug }: { boardSlug: string }) {
  const router = useRouter();
  const [board, setBoard] = useState<ForumBoard | null>(null);
  const [threads, setThreads] = useState<ForumThreadSummary[]>([]);
  const [threadImageUrls, setThreadImageUrls] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [canCreate, setCanCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    if (!forumIsConfigured()) {
      setBoard(FALLBACK_BOARDS.find((item) => item.slug === boardSlug) ?? null);
      setThreads([]);
      setMessage("FORUM DATABASE MIGRATION PENDING");
      setLoading(false);
      return;
    }
    const { data: authData } = await supabase.auth.getUser();
    setUser(authData.user);
    const { data: boardData, error: boardError } = await supabase
      .from("forum_boards")
      .select("id, slug, title, description, is_private, sort_order")
      .eq("slug", boardSlug)
      .maybeSingle();

    if (boardError || !boardData) {
      const fallback = FALLBACK_BOARDS.find((item) => item.slug === boardSlug) ?? null;
      setBoard(fallback);
      setThreads([]);
      setMessage(fallback?.is_private ? "PRIVATE ACCESS REQUIRED" : "FORUM DATABASE MIGRATION PENDING");
      setLoading(false);
      return;
    }

    const resolvedBoard = boardData as ForumBoard;
    setBoard(resolvedBoard);
    if (authData.user) {
      if (!resolvedBoard.is_private) {
        setCanCreate(true);
      } else {
        const [{ data: profile }, { data: membership }] = await Promise.all([
          supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle(),
          supabase.from("forum_memberships").select("membership_role").eq("board_id", resolvedBoard.id).eq("user_id", authData.user.id).maybeSingle(),
        ]);
        setCanCreate(
          profile?.role === "admin" ||
          profile?.role === "moderator" ||
          membership?.membership_role === "publisher" ||
          membership?.membership_role === "moderator",
        );
      }
    } else {
      setCanCreate(false);
    }
    const { data: threadData, error: threadError } = await supabase
      .from("forum_threads")
      .select("id, slug, title, is_pinned, is_locked, reply_count, created_at, last_post_at, legacy_author_name, author:profiles!forum_threads_author_id_fkey(username)")
      .eq("board_id", resolvedBoard.id)
      .order("is_pinned", { ascending: false })
      .order("last_post_at", { ascending: false });
    if (threadError) setMessage(threadError.message.toUpperCase());
    const resolvedThreads = (threadData ?? []) as unknown as ForumThreadSummary[];
    setThreads(resolvedThreads);

    const threadIds = resolvedThreads.map((thread) => thread.id);
    if (threadIds.length) {
      const { data: postData } = await supabase
        .from("forum_posts")
        .select("thread_id, attachments:forum_attachments(id, file_name, mime_type, size_bytes, storage_path)")
        .in("thread_id", threadIds)
        .order("created_at");

      const firstImages = new Map<string, ForumAttachment>();
      for (const post of postData ?? []) {
        if (firstImages.has(post.thread_id)) continue;
        const image = (post.attachments as ForumAttachment[] | null)?.find(isImageAttachment);
        if (image) firstImages.set(post.thread_id, image);
      }
      const urlsByAttachment = await createForumImageUrls([...firstImages.values()]);
      setThreadImageUrls(
        Object.fromEntries(
          [...firstImages].flatMap(([threadId, attachment]) =>
            urlsByAttachment[attachment.id] ? [[threadId, urlsByAttachment[attachment.id]]] : [],
          ),
        ),
      );
    } else {
      setThreadImageUrls({});
    }
    setLoading(false);
  }, [boardSlug]);

  useEffect(() => {
    Promise.resolve().then(load);
    const { data } = supabase.auth.onAuthStateChange(() => load());
    return () => data.subscription.unsubscribe();
  }, [load]);

  const uploadAttachment = async (created: CreatedThread) => {
    if (!file || !board) return;
    if (file.size > 250 * 1024 * 1024) throw new Error("FILE EXCEEDS 250 MB LIMIT");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const storagePath = `${board.id}/${created.thread_id}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("forum-files").upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { error: recordError } = await supabase.from("forum_attachments").insert({
      post_id: created.post_id,
      uploader_id: user?.id,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    });
    if (recordError) throw recordError;
  };

  const createThread = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !board?.id) return;
    setBusy(true);
    setMessage("");
    const { data, error } = await supabase.rpc("create_forum_thread", {
      p_board_id: board.id,
      p_title: title.trim(),
      p_body: body.trim(),
    });
    if (error) {
      setMessage(error.message.toUpperCase());
      setBusy(false);
      return;
    }
    const created = (Array.isArray(data) ? data[0] : data) as CreatedThread | null;
    if (!created) {
      setMessage("TOPIC CREATION FAILED");
      setBusy(false);
      return;
    }
    try {
      await uploadAttachment(created);
      router.push(`/boards/${board.slug}/${created.thread_slug}`);
    } catch (attachmentError) {
      setMessage(`TOPIC CREATED, FILE FAILED: ${attachmentError instanceof Error ? attachmentError.message : "UNKNOWN ERROR"}`);
      setBusy(false);
      await load();
    }
  };

  if (!board && loading) return <p className="forum-notice">CONNECTING_TO_BOARD...</p>;

  return (
    <div className="space-y-8">
      <section className="forum-panel">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <p className="forum-kicker">{board?.is_private ? "PRIVATE CHANNEL" : "PUBLIC CHANNEL"}</p>
            <h1 className="text-3xl md:text-4xl nasalization text-nasa-blue mt-2">/{boardSlug}/ {board?.title}</h1>
            <p className="font-mono text-sm text-gray-500 mt-3">{board?.description}</p>
          </div>
          {board?.is_private ? <span className="forum-status forum-status-private">MEMBERS ONLY</span> : null}
        </div>
      </section>

      {message ? <p className="forum-notice">{message}</p> : null}

      {user && board?.id && canCreate ? (
        <details className="forum-panel group" open={threads.length === 0}>
          <summary className="cursor-pointer nasalization text-nasa-blue">OPEN NEW TOPIC</summary>
          <form className="mt-6 space-y-4" onSubmit={createThread}>
            <label className="forum-label">SUBJECT<input className="forum-input" value={title} onChange={(event) => setTitle(event.target.value)} minLength={3} maxLength={140} required /></label>
            <label className="forum-label">MESSAGE<textarea className="forum-input min-h-36" value={body} onChange={(event) => setBody(event.target.value)} minLength={1} maxLength={20000} required /></label>
            <label className="forum-label">
              {board.is_private ? "SOFTWARE PACKAGE OR ATTACHMENT (OPTIONAL, 250 MB MAX)" : "ATTACHMENT (OPTIONAL, 250 MB MAX)"}
              <input className="forum-input file:mr-4 file:border-0 file:bg-nasa-blue file:text-white file:px-3 file:py-2" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
            <button className="forum-button" type="submit" disabled={busy}>{busy ? "TRANSMITTING..." : "PUBLISH TOPIC"}</button>
          </form>
        </details>
      ) : user && board?.id && board.is_private ? (
        <div className="forum-panel">
          <p className="font-mono text-sm">PRIVATE ACCESS ACTIVE // SOFTWARE RELEASE TOPICS ARE PUBLISHED BY THE OWNER.</p>
        </div>
      ) : (
        <div className="forum-panel flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-sm">SIGN IN TO OPEN TOPICS OR REPLY.</p>
          <Link className="forum-button" href={`/boards/account?next=/boards/${boardSlug}`}>MEMBER SIGN IN</Link>
        </div>
      )}

      <section className="space-y-3">
        <div className="forum-thread-row forum-thread-heading">
          <span>TOPIC</span><span className="hidden md:block">REPLIES</span><span className="hidden md:block">LAST SIGNAL</span>
        </div>
        {loading ? <p className="forum-notice">RECEIVING TOPICS...</p> : null}
        {!loading && threads.length === 0 ? <p className="forum-empty">NO TOPICS IN THIS CHANNEL</p> : null}
        {threads.map((thread) => (
          <Link href={`/boards/${boardSlug}/${thread.slug}`} key={thread.id} className="forum-thread-row group">
            <div className="forum-thread-summary">
              {threadImageUrls[thread.id] ? (
                // Signed storage URLs are already authorized and are intentionally rendered without image proxying.
                // eslint-disable-next-line @next/next/no-img-element
                <img className="forum-thread-thumbnail" src={threadImageUrls[thread.id]} alt="" loading="lazy" />
              ) : null}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {thread.is_pinned ? <span className="forum-tag">PINNED</span> : null}
                  {thread.is_locked ? <span className="forum-tag">LOCKED</span> : null}
                </div>
                <h2 className="font-bold text-nasa-blue group-hover:text-nasa-red mt-1 break-words">{thread.title}</h2>
                <p className="text-[10px] font-mono text-gray-500 mt-1">BY {thread.author?.username ?? thread.legacy_author_name ?? "ARCHIVED_USER"}</p>
              </div>
            </div>
            <span className="hidden md:block font-mono text-sm">{thread.reply_count}</span>
            <span className="hidden md:block font-mono text-xs text-gray-500">{formatForumDate(thread.last_post_at)}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
