import { MetadataRoute } from 'next';
import { getAllPostData } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.illphated.com';
  
  // Get all archive posts
  const posts = getAllPostData();
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/archive/${post.slug}`,
    lastModified: new Date(post.date || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/boards`,
      lastModified: new Date(),
      changeFrequency: 'always' as const,
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...postUrls];
}
