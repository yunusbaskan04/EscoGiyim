import Image from 'next/image';
import { db, safeQuery } from '@/lib/db';
import { getSiteSettings } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import { SchoolsSearchGrid, SchoolItemData } from '@/components/schools/schools-search-grid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Okul Listemiz - ${settings?.businessName || 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim'}`,
    description: 'Kıyafetlerini tedarik ettiğimiz okul listemiz ve Selanik kumaş örnek öğrenci formaları.',
  };
}

export default async function SchoolsPage() {
  const [settings, schoolsFromDb] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      () =>
        db.school.findMany({
          where: { isActive: true, isDeleted: false },
          orderBy: { sortOrder: 'asc' },
        }),
      []
    ),
  ]);

  const schoolItems: SchoolItemData[] = (schoolsFromDb as any[]).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logoUrl,
    description: s.description,
  }));

  const promoImages = [
    { url: '/images/reklam/ornek-forma-1.jpg', title: 'Beyaz Temalı Öğrenci Üniforma Serisi', tag: 'Selanik Kumaş' },
    { url: '/images/reklam/ornek-forma-2.jpg', title: 'Turuncu Temalı Öğrenci Üniforma Serisi', tag: 'Özel Renk Serisi' },
    { url: '/images/reklam/ornek-forma-3.jpg', title: 'Yeşil Temalı Öğrenci Üniforma Serisi', tag: '%100 Pamuk Dokusu' },
    { url: '/images/reklam/ornek-forma-4.jpg', title: 'Bordo Temalı Öğrenci Üniforma Serisi', tag: 'Dayanıklı Dikiş' },
  ];

  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber" className="gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-widest">
            <GraduationCap className="h-4 w-4 text-amber-600" />
            <span>Kıyafeti Tedarik Edilen Okullar</span>
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-slate-900 leading-tight">
            Anlaşmalı Okul Listemiz
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Aşağıda bölgemizde bulunan ve resmi Selanik kumaş kıyafetlerini mağazamızdan tedarik edebileceğiniz okul listesi yer almaktadır. Aradığınız okulu yazıp bulabilir, WhatsApp üzerinden beden ve detay bilgisi alabilirsiniz.
          </p>
        </div>

        {/* DATABASE SCHOOLS LIVE SEARCH GRID */}
        <SchoolsSearchGrid
          schools={schoolItems}
          whatsappNumber={settings?.whatsapp || '905323137837'}
        />

        {/* PROMOTIONAL STUDENT UNIFORM PHOTOS SHOWCASE */}
        <div className="space-y-8 bg-slate-900 p-8 sm:p-12 rounded-3xl text-white">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="amber" className="uppercase tracking-widest text-[11px]">
              Örnek Forma Koleksiyonu
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Örnek Öğrenci Formalarımız & Selanik Kumaş Kalitesi
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Fotoğraflar örnek modeller olup tüm okullarımızın resmi amblem ve renklerine uygun olarak mağazamızda yer almaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg group">
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px]">
                    {img.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-serif font-bold">
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
