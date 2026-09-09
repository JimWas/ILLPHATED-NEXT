"use client";

import { useCallback, useEffect, useState } from "react";
import { forumIsConfigured, type ForumBoard } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

type Membership = {
  board_id: string;
  user_id: string;
  membership_role: string;
  board: { title: string; slug: string } | null;
  profile: { username: string } | null;
};

export default function ForumAdmin() {
  const [authorized, setAuthorized] = useState(false);
  const [boards, setBoards] = useState<ForumBoard[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [email, setEmail] = useState("");
  const [boardSlug, setBoardSlug] = useState("releases");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!forumIsConfigured()) return;
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle();
    const isStaff = profile?.role === "admin" || profile?.role === "moderator";
    setAuthorized(isStaff);
    if (!isStaff) return;
    const [{ data: boardData }, { data: membershipData }] = await Promise.all([
      supabase.from("forum_boards").select("id, slug, title, description, is_private, sort_order").eq("is_private", true).order("sort_order"),
      supabase.from("forum_memberships").select("board_id, user_id, membership_role, board:forum_boards!forum_memberships_board_id_fkey(title, slug), profile:profiles!forum_memberships_user_id_fkey(username)").order("created_at"),
    ]);
    setBoards((boardData ?? []) as ForumBoard[]);
    setMemberships((membershipData ?? []) as unknown as Membership[]);
  }, []);

  useEffect(() => { Promise.resolve().then(load); }, [load]);

  const grant = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await supabase.rpc("admin_grant_private_forum_access", { p_email: email.trim(), p_board_slug: boardSlug });
    setMessage(error ? error.message.toUpperCase() : "PRIVATE ACCESS GRANTED");
    if (!error) { setEmail(""); await load(); }
    setBusy(false);
  };

  const revoke = async (membership: Membership) => {
    if (!window.confirm(`Remove ${membership.profile?.username ?? "this member"} from /${membership.board?.slug ?? "private"}/?`)) return;
    const { error } = await supabase.from("forum_memberships").delete().eq("board_id", membership.board_id).eq("user_id", membership.user_id);
    setMessage(error ? error.message.toUpperCase() : "PRIVATE ACCESS REVOKED");
    if (!error) await load();
  };

  if (!forumIsConfigured()) return <p className="forum-notice">FORUM DATABASE MIGRATION PENDING</p>;
  if (!authorized) return <p className="forum-notice">ADMINISTRATOR ACCESS REQUIRED</p>;

  return (
    <div className="space-y-8">
      <section className="forum-panel">
        <p className="forum-kicker">ACCESS CONTROL</p>
        <h1 className="text-3xl nasalization text-nasa-blue mt-2">PRIVATE FORUM MEMBERS</h1>
        <form className="grid md:grid-cols-[1fr_220px_auto] gap-4 mt-8 items-end" onSubmit={grant}>
          <label className="forum-label">REGISTERED MEMBER EMAIL<input className="forum-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="forum-label">PRIVATE BOARD<select className="forum-input" value={boardSlug} onChange={(event) => setBoardSlug(event.target.value)}>{boards.map((board) => <option key={board.id} value={board.slug}>/{board.slug}/</option>)}</select></label>
          <button className="forum-button" type="submit" disabled={busy}>{busy ? "GRANTING..." : "GRANT ACCESS"}</button>
        </form>
        {message ? <p className="forum-notice mt-5">{message}</p> : null}
      </section>
      <section className="forum-panel">
        <h2 className="nasalization text-nasa-blue mb-5">AUTHORIZED MEMBERS</h2>
        <div className="space-y-2">
          {memberships.length === 0 ? <p className="forum-empty">NO PRIVATE MEMBERSHIPS</p> : null}
          {memberships.map((membership) => (
            <div key={`${membership.board_id}-${membership.user_id}`} className="flex flex-wrap items-center justify-between gap-4 border border-gray-200 p-4 font-mono text-xs">
              <span><strong>{membership.profile?.username ?? "UNKNOWN"}</strong>{` // /${membership.board?.slug ?? "private"}/ // ${membership.membership_role}`}</span>
              <button className="text-nasa-red underline" onClick={() => revoke(membership)}>REVOKE</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
