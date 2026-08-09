'use client';

import * as React from 'react';
import Image from 'next/image';
import { Search, GraduationCap, Shirt, Maximize2, MessageCircle, Filter, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LightboxModal, LightboxImage } from '@/components/common/lightbox-modal';
import { cn } from '@/lib/utils';

export interface ProductCatalogItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  images: { id: string; url: string; isCover: boolean }[];
  sizes: { id: string; name: string }[];
}

export interface SchoolFilterOption {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface ProductCatalogGridProps {
  products: ProductCatalogItem[];
  schools: SchoolFilterOption[];
  whatsappNumber?: string;
}

export function ProductCatalogGrid({
  products,
  schools,
  whatsappNumber = '905323137837',
}: ProductCatalogGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string>('ALL');

  // Lightbox modal state
  const [activeLightboxImages, setActiveLightboxImages] = React.useState<LightboxImage[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const openLightbox = (images: { url: string; title?: string }[], index: number = 0) => {
    setActiveLightboxImages(images.map((img) => ({ url: img.url, title: img.title })));
    setLightboxInitialIndex(index);
    setIsLightboxOpen(true);
  };

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      // School filter
      if (selectedSchoolId !== 'ALL' && p.schoolId !== selectedSchoolId) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSchool = p.schoolName.toLowerCase().includes(q);
        const matchDesc = p.description ? p.description.toLowerCase().includes(q) : false;
        if (!matchName && !matchSchool && !matchDesc) return false;
      }
      return true;
    });
  }, [products, selectedSchoolId, searchQuery]);

  return (
    <div className="space-y-8 w-full">
      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        images={activeLightboxImages}
        initialIndex={lightboxInitialIndex}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* SEARCH BAR & SCHOOL FILTER BAR */}
      <div className="space-y-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Okul adı veya kıyafet ara (örn: Atatürk Lisesi tişört, eşofman)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-10 h-12 text-sm sm:text-base rounded-2xl border-slate-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-lg"
            >
              Temizle
            </button>
          )}
        </div>

        {/* SCHOOL FILTER CHIPS / PILLS */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-amber-500" />
              <span>Okula Göre Filtrele</span>
            </span>
            <span>{filteredProducts.length} Ürün Gösteriliyor</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            <button
              onClick={() => setSelectedSchoolId('ALL')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0',
                selectedSchoolId === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              Tüm Okullar ({products.length})
            </button>

            {schools.map((school) => {
              const selected = selectedSchoolId === school.id;
              return (
                <button
                  key={school.id}
                  onClick={() => setSelectedSchoolId(school.id)}
                  className={cn(
                    'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                    selected
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  {school.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID (Trendyol / E-Commerce Style) */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-sm">
          <Shirt className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="text-lg font-bold text-slate-800">Aramanıza Uygun Okul Kıyafeti Bulunamadı</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Farklı bir okul adı veya arama terimi deneyebilir ya da WhatsApp hattımızdan sorabilirsiniz.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedSchoolId('ALL');
            }}
            className="text-xs font-bold"
          >
            Tüm Üniformaları Göster
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const coverImage = product.images.find((img) => img.isCover) || product.images[0];
            const displayUrl = coverImage
              ? coverImage.url
              : 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80';

            const formattedImages =
              product.images.length > 0
                ? product.images.map((img) => ({ url: img.url, title: `${product.schoolName} - ${product.name}` }))
                : [{ url: displayUrl, title: `${product.schoolName} - ${product.name}` }];

            const waMsg = `Merhaba, Esco Giyim web sitenizden ulaşıyorum. ${product.schoolName} okulunun "${product.name}" kıyafeti hakkında bilgi ve beden siparişi danışmak istiyorum.`;

            return (
              <Card
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 h-full bg-white"
              >
                {/* Product Image Showcase */}
                <div
                  onClick={() => openLightbox(formattedImages, 0)}
                  className="relative h-60 w-full bg-slate-100 cursor-pointer overflow-hidden shrink-0"
                >
                  <Image
                    src={displayUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="rounded-full bg-slate-900/90 p-2.5 text-white shadow-lg flex items-center gap-1.5 text-xs font-bold">
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>Görseli Büyüt</span>
                    </div>
                  </div>

                  {/* School Badge Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <Badge variant="amber" className="shadow-md font-bold text-[10px] sm:text-xs truncate max-w-[85%]">
                      <GraduationCap className="h-3 w-3 shrink-0 mr-1" />
                      <span className="truncate">{product.schoolName}</span>
                    </Badge>
                  </div>
                </div>

                {/* Card Content & Sizes & Buttons */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold font-serif text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2.25rem]">
                      {product.description || '%100 Pamuklu onaylı kumaş, orijinal nakışlı okul üniforması.'}
                    </p>

                    {/* Size Badges */}
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Bedenler
                      </span>
                      {product.sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((sz) => (
                            <span
                              key={sz.id}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold"
                            >
                              {sz.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">Tüm Bedenler Hazır</span>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Order Action */}
                  <div className="pt-2 mt-auto">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 transition shadow-md group-hover:shadow-lg"
                    >
                      <MessageCircle className="h-4 w-4 shrink-0" />
                      <span>WhatsApp İle Sipariş Ver</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
