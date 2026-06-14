import { getPostData, getAllPostData } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export async function generateStaticParams() {
  const posts = getAllPostData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const postData = await getPostData(slug);
  const baseUrl = "https://www.illphated.com";
  
  const title = postData.title || slug;
  const description = postData.excerpt || `Mission Log transmission from illphated.com: ${title}`;
  const imageUrl = postData.featured_image ? `${baseUrl}${postData.featured_image}` : `${baseUrl}/nasa-og.png`;

  return {
    title: `${title} | ILLPHATED.COM`,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/archive/${slug}`,
      siteName: "ILLPHATED.COM",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      publishedTime: postData.date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Post(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const postData = await getPostData(slug);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-nasa-blue text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b-4 border-nasa-red">
        <Link href="/archive" className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl tracking-widest nasalization">MISSION_LOG</h1>
        </Link>
        <Link href="/archive" className="text-xs nasalization border border-white px-2 py-1 hover:bg-white hover:text-nasa-blue transition-colors">BACK TO ARCHIVE</Link>
      </header>

      <main className="flex-1 p-6 md:p-12 command-grid">
        <article className="max-w-4xl mx-auto bg-white border-x border-b border-gray-200 shadow-2xl overflow-hidden">
          <div className="bg-gray-100 p-8 border-b-2 border-nasa-blue">
            <div className="flex items-center gap-2 mb-4">
               <span className="w-3 h-3 bg-nasa-red rounded-full animate-pulse"></span>
               <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">TRANSMISSION_ID: {postData.slug}</span>
            </div>
            <h1 className="text-4xl md:text-5xl text-nasa-blue nasalization leading-tight mb-4">{postData.title || postData.slug}</h1>
            <div className="flex flex-wrap gap-6 text-sm font-mono text-gray-500">
              <p>DATE: {postData.date}</p>
              <p>STATUS: PUBLISHED</p>
              <p>AUTHOR: {postData.author || "ILLPHATED"}</p>
            </div>
          </div>

          {postData.featured_image && (
            <div className="w-full border-b-2 border-nasa-blue bg-black flex justify-center overflow-hidden">
               <img 
                 src={postData.featured_image} 
                 alt="" 
                 className="max-w-full h-auto object-contain"
               />
            </div>
          )}

          <div 
            className="p-8 md:p-12 prose prose-lg max-w-none prose-headings:nasalization prose-headings:text-nasa-blue prose-a:text-nasa-red prose-img:border-2 prose-img:border-nasa-blue"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />
          
          <div className="bg-nasa-blue text-white p-4 text-center text-xs nasalization tracking-widest">
            END OF TRANSMISSION // ILLPHATED.COM
          </div>
        </article>
      </main>
    </div>
  );
}
