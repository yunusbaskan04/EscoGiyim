import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { SchoolDetailView, SchoolDetailData } from '@/components/schools/school-detail-view';

export const revalidate = 60;

interface SchoolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SchoolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await db.school.findUnique({
    where: { slug },
  });

  if (!school) {
    return { title: 'Okul Bulunamadı' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://escogiyim.com.tr';
  const title = `Bitlis ${school.name} Forması & Okul Kıyafeti`;
  const description = `${school.name} resmi kız ve erkek öğrenci okul formaları Esco Giyim mağazamızda mevcuttur.`;
  const schoolUrl = `${siteUrl}/schools/${school.slug}`;

  return {
    title,
    description,
    keywords: [
      `Bitlis ${school.name} Forması`,
      `${school.name} Kıyafetleri`,
      `${school.name} Üniforması`,
      `Bitlis ${school.name} Okul Tişörtü`,
      'Bitlis Okul Forması',
      'Esco Giyim Bitlis',
    ],
    alternates: {
      canonical: schoolUrl,
    },
    openGraph: {
      title: `${title} | Esco Giyim Bitlis`,
      description,
      url: schoolUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Esco Giyim Bitlis`,
      description,
    },
  };
}

export default async function SchoolDetailPage({ params }: SchoolDetailPageProps) {
  const { slug } = await params;

  const schoolDb = await db.school.findFirst({
    where: { slug, isDeleted: false },
  });

  if (!schoolDb) {
    notFound();
  }

  const settings = await db.siteSettings.findUnique({ where: { id: 'default' } });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://escogiyim.com.tr';
  const schoolUrl = `${siteUrl}/schools/${schoolDb.slug}`;

  const schoolData: SchoolDetailData = {
    id: schoolDb.id,
    name: schoolDb.name,
    slug: schoolDb.slug,
    logoUrl: schoolDb.logoUrl,
    description: schoolDb.description,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Anasayfa',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Okul Listemiz',
            item: `${siteUrl}/schools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${schoolDb.name} Forması`,
            item: schoolUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': schoolUrl,
        url: schoolUrl,
        name: `Bitlis ${schoolDb.name} Okul Kıyafeti & Forması`,
        description:
          schoolDb.description ||
          `${schoolDb.name} resmi öğrenci kıyafeti, Selanik kumaş polo tişört ve sweatshirt takımı Esco Giyim Bitlis mağazamızda mevcuttur.`,
        provider: {
          '@type': 'ClothingStore',
          name: 'Esco Giyim Bitlis',
          url: siteUrl,
        },
      },
      {
        '@type': 'Service',
        name: `${schoolDb.name} Okul Forması Temin Hizmeti`,
        description: `${schoolDb.name} resmi öğrenci kıyafetleri, Selanik kumaş polo tişört, sweatshirt, beden uyum garantisi ve paça tadilatı hizmeti.`,
        provider: {
          '@type': 'ClothingStore',
          name: 'Esco Giyim Bitlis',
          telephone: '+905323137837',
          url: siteUrl,
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Bitlis',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col w-full py-12 md:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <SchoolDetailView school={schoolData} whatsappNumber={settings?.whatsapp} />
        </div>
      </div>
    </>
  );
}

