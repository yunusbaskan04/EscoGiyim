import { MetadataRoute } from 'next';
import { db, safeQuery } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://escogiyim.com';

  const staticRoutes = ['', '/about', '/schools', '/faq', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const schools = await safeQuery(
    () =>
      db.school.findMany({
        where: { isActive: true, isDeleted: false },
        select: { slug: true, updatedAt: true },
      }),
    []
  );

  const schoolRoutes = schools.map((school) => ({
    url: `${baseUrl}/schools/${school.slug}`,
    lastModified: school.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...schoolRoutes];
}
