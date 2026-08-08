import { db, safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { SchoolsSearchGrid, SchoolItemData } from '@/components/schools/schools-search-grid';

import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Okullar ve Üniformalar - ${settings?.businessName || 'Esco Giyim Terzilik'}`,
    description: 'Anlaşmalı olduğumuz okullar ve resmi öğrenci kıyafeti modelleri.',
  };
}

export default async function SchoolsPage() {
  const schoolsFromDb = await safeQuery(
    () =>
      db.school.findMany({
        where: { isActive: true, isDeleted: false },
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: { products: { where: { isActive: true, isDeleted: false } } },
          },
        },
      }),
    []
  );

  const schools: SchoolItemData[] = schoolsFromDb.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logoUrl,
    description: s.description,
    productCount: s._count.products,
  }));

  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">Resmi Katalog</Badge>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">Anlaşmalı Okullarımız</h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Okulunuzu seçerek polo yaka tişört, eşofman takımı, sweatshirt ve kıyafet modellerimizi bedenleriyle birlikte detaylıca inceleyebilirsiniz.
          </p>
        </div>

        {/* Live Search & Grid */}
        <SchoolsSearchGrid schools={schools} />
      </div>
    </div>
  );
}
