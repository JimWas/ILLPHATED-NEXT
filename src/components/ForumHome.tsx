"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FALLBACK_BOARDS, forumIsConfigured, type ForumBoard } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

export default function ForumHome() {
  const [boards, setBoards] = useState<ForumBoard[]>(FALLBACK_BOARDS);
  const [user, setUser] = useState<User | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!forumIsConfigured()) return;
    const load = async () => {
      const [{ data: authData }, { data, error }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("forum_boards").select("id, slug, title, description, is_private, sort_order").order("sort_order"),
      ]);
      setUser(authData.user);
      if (data?.length) {
        const visible = data as ForumBoard[];
        setBoards(authData.user ? visible : [...visible, FALLBACK_BOARDS[4]]);
      } else if (error && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        setNotice("FORUM_DATABASE_MIGRATION_PENDING");
      }
    };
    load();
  }, []);

  return (
    <div>
      {notice ? <p className="forum-notice mb-6">{notice}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {boards.map((board) => {
          const locked = board.is_private && !user;
          return (
            <Link
              key={board.slug}
              href={locked ? "/boards/account?next=/boards/releases" : `/boards/${board.slug}`}
              className={`forum-board-card group ${board.is_private ? "forum-board-card-private" : ""}`}
            >
              <div className="flex justify-between items-start mb-4 gap-4">
                <h3 className="text-3xl text-nasa-blue nasalization group-hover:text-nasa-red transition-colors">/{board.slug}/</h3>
                <span className={`forum-status ${board.is_private ? "forum-status-private" : ""}`}>
                  {locked ? "LOCKED" : board.is_private ? "AUTHORIZED" : "ACTIVE"}
                </span>
              </div>
              <h4 className="text-sm font-bold tracking-widest nasalization mb-2">{board.title}</h4>
              <p className="text-xs font-mono text-gray-500">{board.description}</p>
              {board.is_private ? (
                <p className="text-[10px] font-mono text-nasa-red mt-5 border-t border-red-100 pt-3">
                  ACCOUNT + MEMBERSHIP REQUIRED // PRIVATE SOFTWARE DOWNLOADS
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
