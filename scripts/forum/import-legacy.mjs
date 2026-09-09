#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const commit = args.includes("--commit");
const inputPath = args.find((arg) => !arg.startsWith("--"));

if (!inputPath) {
  console.error("Usage: npm run forum:import -- path/to/normalized-forum.json [--commit]");
  process.exit(1);
}

const payload = JSON.parse(await readFile(inputPath, "utf8"));
if (!payload.source || !Array.isArray(payload.topics)) throw new Error("Input requires source and topics[]");

const summary = {
  source: payload.source,
  boards: new Set(payload.topics.map((topic) => topic.board_slug)).size,
  topics: payload.topics.length,
  posts: payload.topics.reduce((count, topic) => count + (topic.posts?.length ?? 0), 0),
  redirects: payload.topics.reduce((count, topic) => count + (topic.legacy_url_ids?.length ?? 0), 0),
};

console.log(JSON.stringify(summary, null, 2));
if (!commit) {
  console.log("Dry run only. Add --commit after reviewing the counts.");
  process.exit(0);
}

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for --commit");

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150) || "archived-topic";
}

for (const topic of payload.topics) {
  if (!topic.legacy_id || !topic.board_slug || !topic.title || !Array.isArray(topic.posts) || topic.posts.length === 0) {
    throw new Error(`Invalid topic record: ${JSON.stringify(topic).slice(0, 200)}`);
  }
  const { data: board, error: boardError } = await supabase
    .from("forum_boards")
    .select("id, slug")
    .eq("slug", topic.board_slug)
    .single();
  if (boardError) throw boardError;

  const threadSlug = `${slugify(topic.title)}-${String(topic.legacy_id).replace(/[^a-zA-Z0-9]/g, "").slice(-10)}`.slice(0, 170);
  const firstPost = topic.posts[0];
  const { data: thread, error: threadError } = await supabase
    .from("forum_threads")
    .upsert({
      board_id: board.id,
      title: String(topic.title).slice(0, 140),
      slug: threadSlug,
      created_at: firstPost.created_at,
      updated_at: topic.posts.at(-1).created_at,
      last_post_at: topic.posts.at(-1).created_at,
      legacy_source: payload.source,
      legacy_id: String(topic.legacy_id),
      legacy_author_name: firstPost.author_name || null,
    }, { onConflict: "legacy_source,legacy_id" })
    .select("id")
    .single();
  if (threadError) throw threadError;

  for (const post of topic.posts) {
    const { error: postError } = await supabase.from("forum_posts").upsert({
      thread_id: thread.id,
      body: String(post.body).slice(0, 20000),
      created_at: post.created_at,
      updated_at: post.updated_at ?? post.created_at,
      legacy_source: payload.source,
      legacy_id: String(post.legacy_id),
      legacy_author_name: post.author_name || null,
    }, { onConflict: "legacy_source,legacy_id" });
    if (postError) throw postError;
  }

  const destinationPath = `/boards/${board.slug}/${threadSlug}`;
  for (const sourceId of topic.legacy_url_ids ?? [topic.legacy_id]) {
    const { error: redirectError } = await supabase.from("forum_legacy_redirects").upsert({
      source_kind: "topic",
      source_id: String(sourceId),
      destination_path: destinationPath,
    });
    if (redirectError) throw redirectError;
  }
}

console.log("Legacy forum import complete.");
