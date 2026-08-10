import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { SchoolDetailView, SchoolDetailData } from '@/components/schools/school-detail-view';

export const revalidate = 60;

interface SchoolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SchoolDetailPageProps) {
  const { slug } = await params;
  const school = await db.school.findUnique({
    where: { slug },
  });

  if (!school) {
    return { title: 'Okul Bulunamadı' };
  }

  return {
    title: `${school.name} Formaları - Esco Giyim Terzilik`,
    description: school.description || `${school.name} resmi kız ve erkek öğrenci üniformaları.`,
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

  const schoolData: SchoolDetailData = {
    id: schoolDb.id,
    name: schoolDb.name,
    slug: schoolDb.slug,
    logoUrl: schoolDb.logoUrl,
    description: schoolDb.description,
  };

  return (
    <div className="flex flex-col w-full py-12 md:py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">
        <SchoolDetailView school={schoolData} whatsappNumber={settings?.whatsapp} />
      </div>
    </div>
  );
}
