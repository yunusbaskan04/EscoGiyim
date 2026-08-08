'use client';

import * as React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { LightboxModal, LightboxImage } from '@/components/common/lightbox-modal';
import { Maximize2, CheckCircle2, GraduationCap, Shirt } from 'lucide-react';

export interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: { id: string; url: string; isCover: boolean }[];
  sizes: { id: string; name: string }[];
}

export interface SchoolDetailData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  products: ProductDetailData[];
}

interface SchoolDetailViewProps {
  school: SchoolDetailData;
  whatsappNumber?: string;
}

export function SchoolDetailView({ school, whatsappNumber = '905321234567' }: SchoolDetailViewProps) {
  const [activeLightboxImages, setActiveLightboxImages] = React.useState<LightboxImage[]>([]);
  const [lightboxInitialIndex, setLightboxInitialIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const openLightbox = (images: { url: string; title?: string }[], index: number = 0) => {
    setActiveLightboxImages(images.map((img) => ({ url: img.url, title: img.title })));
    setLightboxInitialIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="space-y-12">
      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={isLightboxOpen}
        images={activeLightboxImages}
        initialIndex={lightboxInitialIndex}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* School Header Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl bg-slate-800">
          <Image
            src={
              school.logoUrl ||
              'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&auto=format&fit=crop&q=80'
            }
            alt={school.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <Badge variant="amber" className="gap-1.5 w-fit mx-auto md:mx-0">
            <GraduationCap className="h-4 w-4" />
            <span>Resmi Kıyafet Kataloğu</span>
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-white">{school.name}</h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            {school.description ||
              `${school.name} öğrencileri için hazırlanan resmi pamuklu üniformalar, tişörtler, ceketler ve eşofman serisi.`}
          </p>
          <div className="pt-2">
            <WhatsAppButton
              whatsappNumber={whatsappNumber}
              variant="medium"
              label={`${school.name} Formaları İçin WhatsApp Bilgi Al`}
              message={`Merhaba, Esco Giyim web sitenizden ulaşıyorum. ${school.name} okul kıyafetleri hakkında bilgi ve fiyat danışmak istiyorum.`}
            />
          </div>
        </div>
      </div>

      {/* Uniform Products Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Shirt className="h-6 w-6 text-amber-600" />
            <span>Okul Üniforma Modelleri ({school.products.length})</span>
          </h2>
        </div>

        {school.products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <p className="text-slate-500 font-medium">Bu okul için henüz ürün yüklenmemiştir.</p>
            <WhatsAppButton
              whatsappNumber={whatsappNumber}
              variant="medium"
              label="Stok & Bilgi Sorun"
              message={`Merhaba, ${school.name} formaları hakkında bilgi almak istiyorum.`}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {school.products.map((product) => {
              const coverImage = product.images.find((img) => img.isCover) || product.images[0];
              const displayImage = coverImage
                ? coverImage.url
                : 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=80';

              const formattedImages = product.images.length > 0
                ? product.images.map((img) => ({ url: img.url, title: product.name }))
                : [{ url: displayImage, title: product.name }];

              return (
                <Card key={product.id} className="overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300">
                  {/* Product Image Box */}
                  <div
                    onClick={() => openLightbox(formattedImages, 0)}
                    className="relative h-72 w-full bg-slate-100 cursor-pointer overflow-hidden group"
                  >
                    <Image
                      src={displayImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="rounded-full bg-slate-900/90 p-3 text-white shadow-lg flex items-center gap-2 text-xs font-bold">
                        <Maximize2 className="h-4 w-4" />
                        <span>Büyüt & Galeriyi Aç ({product.images.length})</span>
                      </div>
                    </div>
                    {product.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        +{product.images.length} Görsel
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold font-serif text-slate-900">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>
                      )}
                    </div>

                    {/* Sizes Available */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Mevcut Bedenler
                      </span>
                      {product.sizes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((sz) => (
                            <Badge key={sz.id} variant="amber" className="px-3 py-1 text-xs">
                              {sz.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">Özel beden dikimi mevcuttur.</p>
                      )}
                    </div>

                    {/* WhatsApp Action Button */}
                    <div className="pt-2">
                      <WhatsAppButton
                        whatsappNumber={whatsappNumber}
                        variant="large"
                        label="WhatsApp İle Bu Ürünü Sorun"
                        message={`Merhaba, Esco Giyim web sitenizden ulaşıyorum. ${school.name} okulunun "${product.name}" ürünü hakkında bilgi ve beden danışmak istiyorum.`}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Tailoring & Alteration Guarantee Notice */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row items-center gap-4 text-amber-950">
        <CheckCircle2 className="h-8 w-8 text-amber-600 shrink-0" />
        <div className="text-xs md:text-sm space-y-1">
          <strong className="font-bold block text-slate-900">Beden Değişimi ve Paça Tadilatı Garantisi</strong>
          <p className="text-slate-700">
            Esco Giyim mağazamızdan aldığınız tüm ürünlerde beden değişimi imkanı sunulmakta ve paça boyu tadilatı usta terzilerimizce ücretsiz tamamlanmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}
