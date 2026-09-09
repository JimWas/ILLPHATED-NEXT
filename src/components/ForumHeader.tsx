"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { forumIsConfigured } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

export default function ForumHeader({ context }: { context?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState(false);

  useEffect(() => {
    if (!forumIsConfigured()) return;
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
        setStaff(profile?.role === "admin" || profile?.role === "moderator");
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setStaff(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-nasa-blue text-white py-4 px-5 md:px-12 shadow-lg border-b-4 border-nasa-red">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link href="/boards" className="flex items-center gap-3">
          <span className="text-xl md:text-2xl tracking-widest nasalization">OPERATIONS_BOARDS</span>
          {context ? <span className="hidden md:inline text-[10px] font-mono text-blue-100">{"// "}{context}</span> : null}
        </Link>
        <nav className="flex items-center gap-2 text-[10px] nasalization">
          <Link href="/boards" className="forum-header-button">BOARD INDEX</Link>
          <Link href="/boards/account" className="forum-header-button">
            {user ? "ACCOUNT" : "SIGN IN"}
          </Link>
          {staff ? <Link href="/boards/admin" className="forum-header-button">CONTROL</Link> : null}
          <Link href="/" className="forum-header-button">BASE</Link>
        </nav>
      </div>
    </header>
  );
}
