import { MetadataRoute } from 'next';
import { jobs } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hnvns.example';

  // Static routes
  const staticRoutes = [
    '',
    '/services',
    '/about',
    '/insights',
    '/hospitals',
    '/candidates',
    '/contact',
    '/jobs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic job detail routes
  const jobRoutes = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...jobRoutes];
}
