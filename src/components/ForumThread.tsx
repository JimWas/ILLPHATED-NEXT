"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createForumImageUrls, isImageAttachment } from "@/lib/forum-attachments";
import { formatFileSize, formatForumDate, forumIsConfigured, type ForumAttachment, type ForumBoard, type ForumPost } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

type ThreadRecord = {
  id: string;
  title: string;
  slug: string;
  is_locked: boolean;
  is_pinned: boolean;
  board_id: string;
};

export default function ForumThreadView({ boardSlug, threadSlug }: { boardSlug: string; threadSlug: string }) {
  const [board, setBoard] = useState<ForumBoard | null>(null);
  const [thread, setThread] = useState<ThreadRecord | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [canAttach, setCanAttach] = useState(false);
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    if (!forumIsConfigured()) {
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
      setMessage("TOPIC NOT FOUND OR PRIVATE ACCESS REQUIRED");
      setLoading(false);
      return;
    }
    const resolvedBoard = boardData as ForumBoard;
    setBoard(resolvedBoard);
    if (authData.user) {
      if (!resolvedBoard.is_private) setCanAttach(true);
      else {
        const [{ data: profile }, { data: membership }] = await Promise.all([
          supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle(),
          supabase.from("forum_memberships").select("membership_role").eq("board_id", resolvedBoard.id).eq("user_id", authData.user.id).maybeSingle(),
        ]);
        setCanAttach(
          profile?.role === "admin" ||
          profile?.role === "moderator" ||
          membership?.membership_role === "publisher" ||
          membership?.membership_role === "moderator",
        );
      }
    } else setCanAttach(false);
    const { data: threadData, error: threadError } = await supabase
      .from("forum_threads")
      .select("id, title, slug, is_locked, is_pinned, board_id")
      .eq("board_id", resolvedBoard.id)
      .eq("slug", threadSlug)
      .maybeSingle();
    if (threadError || !threadData) {
      setMessage("TOPIC NOT FOUND OR PRIVATE ACCESS REQUIRED");
      setLoading(false);
      return;
    }
    const resolvedThread = threadData as ThreadRecord;
    setThread(resolvedThread);
    const { data: postData, error: postError } = await supabase
      .from("forum_posts")
      .select("id, body, created_at, updated_at, legacy_author_name, author:profiles!forum_posts_author_id_fkey(username), attachments:forum_attachments(id, file_name, mime_type, size_bytes, storage_path)")
      .eq("thread_id", resolvedThread.id)
      .order("created_at");
    if (postError) setMessage(postError.message.toUpperCase());
    else setMessage("");
    const resolvedPosts = (postData ?? []) as unknown as ForumPost[];
    setPosts(resolvedPosts);
    setImageUrls(await createForumImageUrls(resolvedPosts.flatMap((post) => post.attachments ?? [])));
    setLoading(false);
  }, [boardSlug, threadSlug]);

  useEffect(() => {
    Promise.resolve().then(load);
    const { data } = supabase.auth.onAuthStateChange(() => load());
    return () => data.subscription.unsubscribe();
  }, [load]);

  useEffect(() => {
    if (!thread) return;
    const channel = supabase
      .channel(`forum-thread-${thread.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "forum_posts", filter: `thread_id=eq.${thread.id}` }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [thread, load]);

  const uploadAttachment = async (postId: string) => {
    if (!file || !board || !thread) return;
    if (file.size > 250 * 1024 * 1024) throw new Error("FILE EXCEEDS 250 MB LIMIT");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const storagePath = `${board.id}/${thread.id}/${crypto.randomUUID()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("forum-files").upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { error: recordError } = await supabase.from("forum_attachments").insert({
      post_id: postId,
      uploader_id: user?.id,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    });
    if (recordError) throw recordError;
  };

  const reply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!thread || !user) return;
    setBusy(true);
    setMessage("");
    const { data, error } = await supabase.rpc("create_forum_reply", { p_thread_id: thread.id, p_body: body.trim() });
    if (error) {
      setMessage(error.message.toUpperCase());
      setBusy(false);
      return;
    }
    const result = (Array.isArray(data) ? data[0] : data) as { post_id: string } | null;
    try {
      if (result) await uploadAttachment(result.post_id);
      setBody("");
      setFile(null);
      await load();
    } catch (attachmentError) {
      setMessage(`REPLY CREATED, FILE FAILED: ${attachmentError instanceof Error ? attachmentError.message : "UNKNOWN ERROR"}`);
    }
    setBusy(false);
  };

  const download = async (attachment: ForumAttachment) => {
    setMessage("");
    const { data, error } = await supabase.storage.from("forum-files").download(attachment.storage_path);
    if (error) {
      setMessage(error.message.toUpperCase());
      return;
    }
    const url = URL.createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = attachment.file_name;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !thread) return <p className="forum-notice">DECODING_TOPIC...</p>;

  if (!thread || !board) {
    return (
      <section className="forum-panel">
        <h1 className="text-2xl nasalization text-nasa-blue">ACCESS DENIED</h1>
        <p className="forum-notice mt-5">{message}</p>
        <Link className="forum-button inline-block mt-6" href="/boards/account">MEMBER SIGN IN</Link>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="forum-panel">
        <Link href={`/boards/${boardSlug}`} className="forum-kicker hover:text-nasa-red">
          <span>←</span> <span>{`/${boardSlug}/ ${board.title}`}</span>
        </Link>
        <div className="flex flex-wrap gap-3 items-start mt-3">
          {thread.is_pinned ? <span className="forum-tag">PINNED</span> : null}
          {thread.is_locked ? <span className="forum-tag">LOCKED</span> : null}
        </div>
        <h1 className="text-3xl md:text-4xl nasalization text-nasa-blue mt-3 break-words">{thread.title}</h1>
      </section>

      {message ? <p className="forum-notice">{message}</p> : null}

      <section className="space-y-4">
        {posts.map((post, index) => (
          <article className="forum-post" key={post.id} id={`post-${post.id}`}>
            <aside className="forum-post-author">
              <span className="nasalization text-nasa-blue text-sm">{post.author?.username ?? post.legacy_author_name ?? "ARCHIVED_USER"}</span>
              <span className="font-mono text-[10px] text-gray-500 mt-1">{index === 0 ? "ORIGINAL POST" : `REPLY ${index}`}</span>
            </aside>
            <div className="min-w-0">
              <p className="text-[10px] font-mono text-gray-500 mb-4">{formatForumDate(post.created_at)}</p>
              <div className="font-mono text-sm whitespace-pre-wrap break-words leading-6">{post.body}</div>
              {post.attachments?.some(isImageAttachment) ? (
                <div className="forum-inline-images">
                  {post.attachments.filter(isImageAttachment).map((attachment) =>
                    imageUrls[attachment.id] ? (
                      <button
                        type="button"
                        className="forum-inline-image-button"
                        key={attachment.id}
                        onClick={() => download(attachment)}
                        aria-label={`Download ${attachment.file_name}`}
                      >
                        {/* Signed storage URLs are already authorized and are intentionally rendered without image proxying. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="forum-inline-image" src={imageUrls[attachment.id]} alt={attachment.file_name} loading="lazy" />
                      </button>
                    ) : null,
                  )}
                </div>
              ) : null}
              {post.attachments?.length ? (
                <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                  <p className="forum-kicker">SECURE ATTACHMENTS</p>
                  {post.attachments.map((attachment) => (
                    <button key={attachment.id} onClick={() => download(attachment)} className="forum-download">
                      <span>{attachment.file_name}</span>
                      <span>{`${formatFileSize(attachment.size_bytes)} // DOWNLOAD`}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      {user && !thread.is_locked ? (
        <form className="forum-panel space-y-4" onSubmit={reply}>
          <h2 className="nasalization text-nasa-blue">TRANSMIT REPLY</h2>
          <label className="forum-label">MESSAGE<textarea className="forum-input min-h-36" value={body} onChange={(event) => setBody(event.target.value)} maxLength={20000} required /></label>
          {canAttach ? <label className="forum-label">ATTACHMENT (OPTIONAL, 250 MB MAX)<input className="forum-input" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label> : null}
          <button className="forum-button" type="submit" disabled={busy}>{busy ? "TRANSMITTING..." : "POST REPLY"}</button>
        </form>
      ) : thread.is_locked ? (
        <p className="forum-notice">THIS TOPIC IS LOCKED</p>
      ) : (
        <div className="forum-panel flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-sm">SIGN IN TO REPLY.</p>
          <Link className="forum-button" href={`/boards/account?next=/boards/${boardSlug}/${threadSlug}`}>MEMBER SIGN IN</Link>
        </div>
      )}
    </div>
  );
}
