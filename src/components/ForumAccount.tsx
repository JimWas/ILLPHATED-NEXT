"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { forumIsConfigured } from "@/lib/forum";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function ForumAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const requestedNext = searchParams.get("next");
  const nextPath = requestedNext?.startsWith("/boards") ? requestedNext : "/boards";

  useEffect(() => {
    if (!forumIsConfigured()) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    if (mode === "signup") {
      const cleanUsername = username.trim();
      if (!/^[a-zA-Z0-9_-]{3,24}$/.test(cleanUsername)) {
        setMessage("USERNAME MUST BE 3–24 LETTERS, NUMBERS, _ OR -");
        setBusy(false);
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { username: cleanUsername } },
      });
      if (error) setMessage(error.message.toUpperCase());
      else if (data.session) router.push(nextPath);
      else setMessage("CHECK YOUR EMAIL TO CONFIRM THE ACCOUNT");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setMessage(error.message.toUpperCase());
      else router.push(nextPath);
    }
    setBusy(false);
  };

  const signOut = async () => {
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
    router.push("/boards");
  };

  if (!forumIsConfigured()) {
    return (
      <section className="forum-panel max-w-2xl">
        <p className="forum-kicker">SECURE MEMBER ACCESS</p>
        <h2 className="text-2xl nasalization text-nasa-blue mt-2">DATABASE MIGRATION PENDING</h2>
        <p className="forum-notice mt-6">Connect the Supabase environment before creating forum accounts.</p>
      </section>
    );
  }

  if (user) {
    return (
      <section className="forum-panel max-w-2xl">
        <p className="forum-kicker">IDENTITY VERIFIED</p>
        <h2 className="text-2xl nasalization text-nasa-blue mt-2">ACCOUNT ONLINE</h2>
        <p className="font-mono text-sm mt-6 break-all">{user.email}</p>
        <p className="font-mono text-xs text-gray-500 mt-2">
          Private boards appear only after an administrator grants this account membership.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button className="forum-button" onClick={() => router.push(nextPath)}>CONTINUE TO BOARDS</button>
          <button className="forum-button-secondary" onClick={signOut} disabled={busy}>SIGN OUT</button>
        </div>
      </section>
    );
  }

  return (
    <section className="forum-panel max-w-2xl">
      <p className="forum-kicker">SECURE MEMBER ACCESS</p>
      <h2 className="text-2xl nasalization text-nasa-blue mt-2">
        {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
      </h2>
      <form onSubmit={submit} className="mt-8 space-y-5">
        {mode === "signup" ? (
          <label className="forum-label">
            USERNAME
            <input className="forum-input" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
        ) : null}
        <label className="forum-label">
          EMAIL
          <input className="forum-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </label>
        <label className="forum-label">
          PASSWORD
          <input className="forum-input" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
        </label>
        {message ? <p className="forum-notice">{message}</p> : null}
        <button className="forum-button w-full" type="submit" disabled={busy}>
          {busy ? "AUTHENTICATING..." : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
        </button>
      </form>
      <button
        type="button"
        className="mt-6 text-xs font-mono text-nasa-blue underline underline-offset-4"
        onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }}
      >
        {mode === "signin" ? "NEED AN ACCOUNT? REGISTER" : "ALREADY REGISTERED? SIGN IN"}
      </button>
    </section>
  );
}
