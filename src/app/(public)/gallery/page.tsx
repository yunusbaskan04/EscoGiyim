import { db, safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { GalleryMasonry, GalleryItemData } from '@/components/gallery/gallery-masonry';
import { GalleryCategory } from '@/types/enums';

import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Fotoğraf Galerisi - ${settings?.businessName || 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim'}`,
    description: 'Kumaş kalitemiz, mağazamız ve öğrenci okul kıyafetlerimizden özel fotoğraflar.',
  };
}

export default async function GalleryPage() {
  const galleryFromDb = await safeQuery(
    () =>
      db.galleryImage.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    []
  );

  const images: GalleryItemData[] = galleryFromDb.map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category as GalleryCategory,
    imageUrl: g.imageUrl,
  }));

  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">Görsel Albüm</Badge>
          <h1 className="text-4xl font-bold font-serif text-slate-900">Fotoğraf Galerimiz</h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Selanik kumaş kalitemiz, mağazamız, erkek giyim koleksiyonumuz ve öğrenci okul kıyafetlerimizden kareleri inceleyebilirsiniz.
          </p>
        </div>

        {/* Gallery Masonry */}
        <GalleryMasonry images={images} />
      </div>
    </div>
  );
}
