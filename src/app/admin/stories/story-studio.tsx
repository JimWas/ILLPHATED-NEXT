"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { isStoryVideo, type Story } from "@/lib/stories";

type Draft = Pick<Story, "title" | "slug" | "excerpt" | "body" | "cover_url" | "audio_url" | "images" | "featured" | "published">;
const blankDraft: Draft = { title: "", slug: "", excerpt: "", body: "", cover_url: null, audio_url: null, images: [], featured: false, published: false };

export default function StoryStudio() {
  const [session, setSession] = useState<Session | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [draft, setDraft] = useState<Draft>(blankDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) void loadStories(); }, [session]);

  async function loadStories() {
    const { data, error } = await supabase.from("stories").select("*").order("updated_at", { ascending: false });
    if (error) setMessage(error.message);
    else setStories((data ?? []) as Story[]);
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "ACCESS GRANTED");
    setBusy(false);
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function titleChanged(value: string) {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: editingId ? current.slug : value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  }

  async function upload(file: File, kind: "cover" | "audio" | "gallery" | "video") {
    if (kind === "video" && file.type !== "video/mp4" && !file.name.toLowerCase().endsWith(".mp4")) {
      setMessage("SHORT VIDEO MUST BE AN MP4 FILE");
      return;
    }
    if (kind === "video" && file.size > 20 * 1024 * 1024) {
      setMessage("SHORT VIDEO EXCEEDS THE 20 MB LIMIT");
      return;
    }

    setBusy(true);
    setMessage(`UPLOADING ${file.name}…`);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("story-media").upload(path, file);
    if (error) {
      setMessage(error.message);
    } else {
      const { data } = supabase.storage.from("story-media").getPublicUrl(path);
      if (kind === "cover") update("cover_url", data.publicUrl);
      if (kind === "audio") update("audio_url", data.publicUrl);
      if (kind === "gallery" || kind === "video") update("images", [...draft.images, data.publicUrl]);
      setMessage("UPLOAD COMPLETE");
    }
    setBusy(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft.title || !draft.slug || !draft.body) return setMessage("TITLE, URL SLUG, AND STORY TEXT ARE REQUIRED");
    setBusy(true);
    const payload = { ...draft, updated_at: new Date().toISOString() };
    const result = editingId
      ? await supabase.from("stories").update(payload).eq("id", editingId)
      : await supabase.from("stories").insert(payload);
    if (result.error) setMessage(result.error.message);
    else {
      setMessage(draft.published ? "STORY PUBLISHED" : "DRAFT SAVED");
      setDraft(blankDraft);
      setEditingId(null);
      await loadStories();
    }
    setBusy(false);
  }

  function edit(story: Story) {
    setEditingId(story.id);
    setDraft({
      title: story.title, slug: story.slug, excerpt: story.excerpt, body: story.body,
      cover_url: story.cover_url, audio_url: story.audio_url, images: story.images ?? [],
      featured: story.featured, published: story.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(story: Story) {
    if (!window.confirm(`Delete “${story.title}”? This cannot be undone.`)) return;
    const { error } = await supabase.from("stories").delete().eq("id", story.id);
    setMessage(error ? error.message : "STORY DELETED");
    if (!error) await loadStories();
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center command-grid p-6">
        <form onSubmit={signIn} className="w-full max-w-md border-t-8 border-nasa-red bg-white p-8 shadow-2xl">
          <p className="font-mono text-xs text-nasa-red">RESTRICTED SYSTEM</p>
          <h1 className="mt-2 text-3xl text-nasa-blue">STORY STUDIO</h1>
          <p className="my-6 text-sm text-gray-600">Sign in with your Illphated author account.</p>
          <label className="studio-label">EMAIL<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="studio-label">PASSWORD<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="studio-button w-full" disabled={busy}>{busy ? "AUTHENTICATING…" : "ENTER STUDIO"}</button>
          {message && <p className="mt-4 font-mono text-xs text-nasa-red">{message}</p>}
          <Link href="/" className="mt-6 block text-center text-xs text-gray-400">← RETURN TO SITE</Link>
        </form>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef1f5]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-nasa-red bg-nasa-blue px-6 py-4 text-white md:px-10">
        <div><p className="font-mono text-[10px] opacity-70">AUTHOR CONSOLE</p><h1 className="text-xl">ILLPHATED // STORY STUDIO</h1></div>
        <div className="flex gap-3"><Link href="/stories" className="studio-header-button">VIEW STORIES</Link><button onClick={() => supabase.auth.signOut()} className="studio-header-button">SIGN OUT</button></div>
      </header>
      <main className="mx-auto grid max-w-7xl gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-10">
        <form onSubmit={save} className="bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
            <div><p className="font-mono text-[10px] text-nasa-red">{editingId ? "EDITING TRANSMISSION" : "NEW TRANSMISSION"}</p><h2 className="mt-1 text-2xl text-nasa-blue">{editingId ? draft.title : "CREATE A SHORT STORY"}</h2></div>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setDraft(blankDraft); }} className="text-xs text-gray-500">CANCEL EDIT</button>}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="studio-label md:col-span-2">STORY TITLE<input value={draft.title} onChange={(e) => titleChanged(e.target.value)} required placeholder="The last signal from..." /></label>
            <label className="studio-label">URL SLUG<input value={draft.slug} onChange={(e) => update("slug", e.target.value)} required /></label>
            <label className="studio-label">SHORT DESCRIPTION<input value={draft.excerpt} onChange={(e) => update("excerpt", e.target.value)} maxLength={240} placeholder="A one-sentence hook for readers." /></label>
            <label className="studio-label md:col-span-2">STORY TEXT<textarea value={draft.body} onChange={(e) => update("body", e.target.value)} rows={20} required placeholder="Paste or write your story here. Leave a blank line between paragraphs." /></label>
          </div>
          <div className="mt-8 grid gap-5 border-t pt-8 md:grid-cols-2 xl:grid-cols-4">
            <FileField label="COVER IMAGE" accept="image/*" current={draft.cover_url} onFile={(file) => upload(file, "cover")} />
            <FileField label="AUDIOBOOK FILE" accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg" current={draft.audio_url} onFile={(file) => upload(file, "audio")} />
            <FileField label="STORY GALLERY" accept="image/*" current={draft.images.length ? `${draft.images.length} image(s)` : null} onFile={(file) => upload(file, "gallery")} />
            <FileField label="SHORT MP4 (MAX 20 MB)" accept="video/mp4,.mp4" current={draft.images.some(isStoryVideo) ? "VIDEO ATTACHED" : null} onFile={(file) => upload(file, "video")} />
          </div>
          {draft.images.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{draft.images.map((url, index) => <button type="button" key={url} onClick={() => update("images", draft.images.filter((item) => item !== url))} className="bg-gray-100 px-3 py-2 text-xs">{isStoryVideo(url) ? "VIDEO" : "IMAGE"} {index + 1} ×</button>)}</div>}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t pt-6">
            <label className="studio-check"><input type="checkbox" checked={draft.published} onChange={(e) => update("published", e.target.checked)} /> PUBLISH NOW</label>
            <label className="studio-check"><input type="checkbox" checked={draft.featured} onChange={(e) => update("featured", e.target.checked)} /> FEATURE ON HOMEPAGE</label>
            <button className="studio-button ml-auto" disabled={busy}>{busy ? "WORKING…" : editingId ? "UPDATE STORY" : "SAVE STORY"}</button>
          </div>
          {message && <p role="status" className="mt-5 border-l-4 border-nasa-red bg-gray-50 p-3 font-mono text-xs">{message}</p>}
        </form>
        <aside>
          <div className="sticky top-6 bg-white p-6 shadow-sm">
            <p className="font-mono text-[10px] text-nasa-red">TRANSMISSION LOG</p>
            <h2 className="mt-1 text-xl text-nasa-blue">YOUR STORIES</h2>
            <div className="mt-5 space-y-3">
              {stories.length === 0 && <p className="text-sm text-gray-500">No stories yet. Create your first transmission.</p>}
              {stories.map((story) => (
                <div key={story.id} className="border p-4">
                  <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold">{story.title}</h3><span className={`h-2 w-2 rounded-full ${story.published ? "bg-green-500" : "bg-amber-400"}`} /></div>
                  <p className="mt-1 font-mono text-[9px] text-gray-400">{story.featured ? "FEATURED // " : ""}{story.published ? "PUBLISHED" : "DRAFT"}</p>
                  <div className="mt-3 flex gap-3 text-[10px] font-bold"><button onClick={() => edit(story)} className="text-nasa-blue">EDIT</button><button onClick={() => remove(story)} className="text-nasa-red">DELETE</button></div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function FileField({ label, accept, current, onFile }: { label: string; accept: string; current: string | null; onFile: (file: File) => void }) {
  return (
    <label className="studio-upload">
      <span>{label}</span>
      <b>{current ? "REPLACE FILE" : "+ SELECT FILE"}</b>
      {current && <small>{current.startsWith("http") ? "FILE ATTACHED" : current}</small>}
      <input type="file" accept={accept} onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file); }} />
    </label>
  );
}
