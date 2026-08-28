import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'https://esco-giyim-beryl.vercel.app';
  const baseUrl = rawUrl.startsWith('http') ? rawUrl.replace(/\/$/, '') : `https://${rawUrl.replace(/\/$/, '')}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

