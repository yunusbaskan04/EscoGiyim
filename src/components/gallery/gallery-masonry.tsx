'use client';

import * as React from 'react';
import Image from 'next/image';
import { GalleryCategory } from '@/types/enums';
import { Badge } from '@/components/ui/badge';
import { LightboxModal, LightboxImage } from '@/components/common/lightbox-modal';
import { cn } from '@/lib/utils';
import { Maximize2, Camera } from 'lucide-react';

export interface GalleryItemData {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
}

interface GalleryMasonryProps {
  images: GalleryItemData[];
}

export function GalleryMasonry({ images }: GalleryMasonryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const categories = [
    { label: 'Tümü', value: 'ALL' },
    { label: 'Mağazamız', value: GalleryCategory.STORE },
    { label: 'Ürünlerimiz', value: GalleryCategory.PRODUCT },
    { label: 'Terzilik & Atölye', value: GalleryCategory.TAILORING },
    { label: 'Diğer Kareler', value: GalleryCategory.OTHER },
  ];

  const filteredImages = React.useMemo(() => {
    if (selectedCategory === 'ALL') return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const lightboxImages: LightboxImage[] = React.useMemo(() => {
    return filteredImages.map((img) => ({
      id: img.id,
      url: img.imageUrl,
      title: img.title,
    }));
  }, [filteredImages]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getCategoryBadgeLabel = (cat: GalleryCategory) => {
    switch (cat) {
      case GalleryCategory.STORE:
        return 'Mağaza';
      case GalleryCategory.PRODUCT:
        return 'Ürün';
      case GalleryCategory.TAILORING:
        return 'Terzilik';
      default:
        return 'Galeri';
    }
  };

  return (
    <div className="space-y-8">
      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              'px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-200',
              selectedCategory === cat.value
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Responsive Masonry / Grid */}
      {filteredImages.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Camera className="mx-auto h-12 w-12 text-slate-300" />
          <p className="text-slate-500 font-medium">Bu kategoride henüz fotoğraf bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => handleOpenLightbox(idx)}
              className="relative break-inside-avoid rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={img.imageUrl}
                alt={img.title}
                width={800}
                height={600}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-5 text-white">
                <div className="flex justify-end">
                  <Badge variant="amber" className="text-[10px] uppercase font-bold">
                    {getCategoryBadgeLabel(img.category)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold truncate pr-2">{img.title}</span>
                  <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
