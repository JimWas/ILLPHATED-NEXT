"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BoardPost {
  id: number;
  created_at: string;
  content: string;
  image_url?: string;
  board: string;
}

export default function BoardFeed({ boardId }: { boardId: string }) {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial posts
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("board", boardId)
        .order("created_at", { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    };

    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`board-${boardId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: `board=eq.${boardId}`,
        },
        (payload) => {
          setPosts((prev) => [payload.new as BoardPost, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const { error } = await supabase.from("posts").insert([
      {
        content: newPost,
        board: boardId,
      },
    ]);

    if (!error) {
      setNewPost("");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-nasa-blue p-6 shadow-[10px_10px_0px_0px_rgba(0,51,160,0.05)]">
        <h3 className="nasalization text-nasa-blue mb-4">NEW_TRANSMISSION</h3>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="ENTER MESSAGE DATA..."
          className="w-full h-24 p-3 border border-gray-300 font-mono text-sm focus:border-nasa-red outline-none transition-colors"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="text-[10px] text-gray-400 font-mono uppercase">
            ENCRYPTION: NONE // ANON_ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
          <button
            type="submit"
            className="bg-nasa-blue text-white px-8 py-2 nasalization text-sm hover:bg-nasa-red transition-colors"
          >
            TRANSMIT
          </button>
        </div>
      </form>

      {/* Posts List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-12 nasalization text-gray-300 animate-pulse">CONNECTING_TO_UPLINK...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 nasalization text-gray-300 italic">SILENCE_IN_THIS_SECTOR</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border-l-4 border-nasa-blue p-4 shadow-sm hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-nasa-red">ID_{post.id} // {new Date(post.created_at).toLocaleString()}</span>
              </div>
              <p className="font-mono text-sm whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
