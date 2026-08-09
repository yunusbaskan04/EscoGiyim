import { db, safeQuery } from '@/lib/db';
import { getSiteSettings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ProductCatalogGrid, ProductCatalogItem, SchoolFilterOption } from '@/components/products/product-catalog-grid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Okullar ve Üniformalar - ${settings?.businessName || 'Esco Giyim Terzilik'}`,
    description: 'Anlaşmalı olduğumuz okullar ve resmi öğrenci kıyafeti modelleri.',
  };
}

export default async function SchoolsPage() {
  const [settings, productsFromDb, schoolsFromDb] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      () =>
        db.product.findMany({
          where: { isActive: true, isDeleted: false },
          orderBy: { updatedAt: 'desc' },
          include: {
            school: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { sortOrder: 'asc' } },
            sizes: { orderBy: { sortOrder: 'asc' } },
          },
        }),
      []
    ),
    safeQuery(
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
    ),
  ]);

  const catalogProducts: ProductCatalogItem[] = (productsFromDb as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    schoolId: p.school.id,
    schoolName: p.school.name,
    schoolSlug: p.school.slug,
    images: (p.images || []).map((img: any) => ({ id: img.id, url: img.imageUrl, isCover: img.isCover })),
    sizes: (p.sizes || []).map((sz: any) => ({ id: sz.id, name: sz.name })),
  }));

  const schoolFilters: SchoolFilterOption[] = (schoolsFromDb as any[]).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    productCount: s._count?.products || 0,
  }));

  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="amber">Resmi Okul Kataloğu</Badge>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">Okul Üniforma Modellerimiz</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Bölgemizdeki okulların resmi kıyafetleri, tişört, kışlık hırka ve eşofman modelleri aşağıda doğrudan listelenmektedir. Okulunuza göre filtreleme yapabilir, beden durumlarını kontrol edebilirsiniz.
          </p>
        </div>

        {/* Live Search, School Filters & Trendyol-Style Product Grid */}
        <ProductCatalogGrid
          products={catalogProducts}
          schools={schoolFilters}
          whatsappNumber={settings?.whatsapp || '905323137837'}
        />
      </div>
    </div>
  );
}
