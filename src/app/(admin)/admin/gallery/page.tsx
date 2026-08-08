import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { GalleryManager, GalleryAdminItem } from '@/components/admin/gallery-manager';
import { GalleryCategory } from '@/types/enums';

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const galleryDb = await safeQuery(
    () =>
      db.galleryImage.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    []
  );

  const images: GalleryAdminItem[] = galleryDb.map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category as GalleryCategory,
    imageUrl: g.imageUrl,
    sortOrder: g.sortOrder,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white">Fotoğraf Galerisi Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">Mağaza, atölye ve ürün fotoğraflarını kategorilere göre yönetin.</p>
      </div>

      <GalleryManager images={images} />
    </div>
  );
}
