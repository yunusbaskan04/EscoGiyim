import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { ProductsManager, ProductAdminItem, SchoolOption } from '@/components/admin/products-manager';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const schoolsDb = await safeQuery(
    () =>
      db.school.findMany({
        where: { isDeleted: false },
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      }),
    []
  );

  const productsDb = await safeQuery(
    () =>
      db.product.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          school: { select: { name: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          sizes: { orderBy: { sortOrder: 'asc' } },
        },
      }),
    []
  );

  const products: ProductAdminItem[] = productsDb.map((p) => ({
    id: p.id,
    schoolId: p.schoolId,
    schoolName: p.school.name,
    name: p.name,
    slug: p.slug,
    description: p.description,
    sortOrder: p.sortOrder,
    isActive: p.isActive,
    isDeleted: p.isDeleted,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.imageUrl,
      isCover: img.isCover,
      sortOrder: img.sortOrder,
    })),
    sizes: p.sizes.map((sz) => ({
      id: sz.id,
      name: sz.name,
      sortOrder: sz.sortOrder,
    })),
  }));

  const schools: SchoolOption[] = schoolsDb.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white">Okul Kıyafetleri Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">Okul kıyafetleri ekleyin, kapak resmi seçin, bedenleri yönetin veya silin.</p>
      </div>

      <ProductsManager products={products} schools={schools} />
    </div>
  );
}
