'use client';

import * as React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { CheckCircle2, GraduationCap, Shirt, Sparkles, MapPin } from 'lucide-react';

export interface SchoolDetailData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
}

interface SchoolDetailViewProps {
  school: SchoolDetailData;
  whatsappNumber?: string;
}

export function SchoolDetailView({ school, whatsappNumber = '905323137837' }: SchoolDetailViewProps) {
  const promoImages = [
    { url: '/images/reklam/ornek-forma-1.jpg', title: 'Lacivert Polo Tişört & Sweatshirt', tag: 'Selanik Kumaş' },
    { url: '/images/reklam/ornek-forma-2.jpg', title: 'Turuncu Detaylı Öğrenci Takımı', tag: 'Nakış Amblemli' },
    { url: '/images/reklam/ornek-forma-3.jpg', title: 'Yeşil Temalı Okul Üniforması', tag: '%100 Pamuklu Doku' },
    { url: '/images/reklam/ornek-forma-4.jpg', title: 'Bordo Okul Tişörtü & Eşofman', tag: 'Usta İşçilik' },
  ];

  return (
    <div className="space-y-12">
      {/* School Header Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
        <div className="relative h-28 w-28 md:h-36 md:w-36 shrink-0 rounded-2xl overflow-hidden border-4 border-amber-500/80 shadow-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
          {school.logoUrl ? (
            <Image
              src={school.logoUrl}
              alt={school.name}
              fill
              sizes="150px"
              className="object-cover"
            />
          ) : (
            <GraduationCap className="h-16 w-16" />
          )}
        </div>

        <div className="space-y-3 text-center md:text-left flex-1">
          <Badge variant="amber" className="gap-1.5 w-fit mx-auto md:mx-0 font-bold">
            <GraduationCap className="h-4 w-4" />
            <span>Okul Kıyafeti Mağazamızda Mevcuttur</span>
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-white">{school.name}</h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            {school.description ||
              `${school.name} öğrencilerimiz için %100 pamuklu Selanik kumaş polo yaka tişört, kışlık sweatshirt ve eşofman takımları Esco Giyim mağazamızda hazırdır.`}
          </p>
          <div className="pt-2">
            <WhatsAppButton
              whatsappNumber={whatsappNumber}
              variant="medium"
              label={`${school.name} Kıyafetleri İçin WhatsApp Sipariş & Bilgi`}
              message={`Merhaba, Esco Giyim web sitenizden ulaşıyorum. "${school.name}" okul kıyafetleri (Selanik tişört, sweatshirt, eşofman) hakkında bilgi ve beden danışmak istiyorum.`}
            />
          </div>
        </div>
      </div>

      {/* Fabric & Quality Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Shirt className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-serif text-slate-900">Selanik Pamuk Kumaş</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Terletmeyen, tüylenmeyen ve yıkanmaya dayanıklı orijinal %100 pamuklu Selanik dokuma.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-serif text-slate-900">Orijinal Okul Amblemi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {school.name} onaylı okul amblem nakışları ve resmi renk standartları.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold font-serif text-slate-900">Tüm Bedenler Hazır</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            İlkokul, ortaokul ve lise tüm yaş gruplarına uygun beden seçenekleri ve ücretsiz paça tadilatı.
          </p>
        </div>
      </div>

      {/* Promotional Uniform Photos Showcase */}
      <div className="space-y-6 bg-slate-900 p-8 rounded-3xl text-white">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="amber" className="text-[11px] font-bold">
            Örnek Formayla Kalite Tanıtımı
          </Badge>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            Esco Giyim Üniforma & Selanik Doku Örnekleri
          </h2>
          <p className="text-xs text-slate-300">
            Aşağıdaki fotoğraflar kumaş kalitemizi gösteren örnek öğrenci modelleridir. {school.name} resmi amblem ve renk kombinasyonu mağazamızda mevcuttur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoImages.map((img, idx) => (
            <div key={idx} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-md group">
              <Image
                src={img.url}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-serif font-bold">
                {img.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alteration Guarantee Notice */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 flex flex-col sm:flex-row items-center gap-4 text-amber-950">
        <CheckCircle2 className="h-8 w-8 text-amber-600 shrink-0" />
        <div className="text-xs md:text-sm space-y-1">
          <strong className="font-bold block text-slate-900">Beden Değişimi ve Paça Tadilatı Garantisi</strong>
          <p className="text-slate-700">
            {school.name} ve tüm okullarımız için mağazamızdan aldığınız öğrenci kıyafetlerinde beden değişimi imkanı sunulmakta ve paça boyu tadilatı usta terzilerimizce ücretsiz yapılmaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}
