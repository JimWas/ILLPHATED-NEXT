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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
    if (!newPost.trim() && !file) return;

    setUploading(true);
    let imageUrl = null;

    try {
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert("FILE_TOO_LARGE: MAX_5MB");
          setUploading(false);
          return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${boardId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('board-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('board-media')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("posts").insert([
        {
          content: newPost,
          board: boardId,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;
      
      setNewPost("");
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("TRANSMISSION_ERROR:", error);
      alert("ERROR: UPLINK_FAILED");
    } finally {
      setUploading(false);
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
          className="w-full h-24 p-3 border border-gray-300 font-mono text-sm focus:border-nasa-red outline-none transition-colors mb-4"
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="file-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 px-4 py-2 text-[10px] nasalization transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {file ? file.name.slice(0, 15) + "..." : "ATTACH_MEDIA_5MB"}
            </label>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden" 
            />
            {file && <button type="button" onClick={() => setFile(null)} className="text-nasa-red text-[10px] nasalization hover:underline">CLEAR</button>}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-[10px] text-gray-400 font-mono uppercase hidden sm:block">
              ENCRYPTION: NONE // ANON_ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
            <button
              type="submit"
              disabled={uploading}
              className={`bg-nasa-blue text-white px-8 py-2 nasalization text-sm transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-nasa-red'}`}
            >
              {uploading ? "TRANSMITTING..." : "TRANSMIT"}
            </button>
          </div>
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
            <div key={post.id} className="bg-white border-l-4 border-nasa-blue p-4 shadow-sm hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6">
              {post.image_url && (
                <div className="w-full md:w-32 h-32 flex-shrink-0">
                  <a href={post.image_url} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={post.image_url} 
                      alt="" 
                      className="w-full h-full object-cover border border-gray-200 hover:border-nasa-blue transition-colors"
                    />
                  </a>
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-nasa-red">ID_{post.id} // {new Date(post.created_at).toLocaleString()}</span>
                </div>
                <p className="font-mono text-sm whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
