import Image from 'next/image';
import { db, safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { Shirt, CheckCircle2, Award, HeartHandshake, ShieldCheck } from 'lucide-react';

import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Hakkımızda - ${settings?.businessName || 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim'}`,
    description: 'Uzun yıllara dayanan tecrübemiz, kaliteli Selanik kumaş seçimimiz ve okul üniformaları ile erkek giyim hizmetimiz.',
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const promoImages = [
    { url: '/images/reklam/ornek-forma-1.jpg', title: 'Beyaz Temalı Öğrenci Üniforma Modeli', tag: 'Selanik Kumaş' },
    { url: '/images/reklam/ornek-forma-2.jpg', title: 'Turuncu Temalı Öğrenci Üniforma Modeli', tag: 'Özel Renk Serisi' },
    { url: '/images/reklam/ornek-forma-3.jpg', title: 'Yeşil Temalı Öğrenci Üniforma Modeli', tag: '%100 Pamuk Dokusu' },
    { url: '/images/reklam/ornek-forma-4.jpg', title: 'Bordo Temalı Öğrenci Üniforma Modeli', tag: 'Dayanıklı Dikiş' },
  ];

  return (
    <div className="flex flex-col w-full py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 space-y-16">

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">Tarihçemiz & Kalitemiz</Badge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight tracking-tight">
            {settings?.aboutTitle || 'Esco Giyim Kalitesi ve Usta İşçilik'}
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Kaliteli pamuk Selanik kumaşlarımızı modern okul kıyafetleri ve şık erkek giyim koleksiyonu ile buluşturuyoruz.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Usta İşçilik ve Dayanıklı Selanik Kumaş Seçimi
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {settings?.aboutContent ||
                'Esco Giyim olarak yıllardır okul üniformaları ve erkek giyim ürünlerinde müşteri memnuniyetini esas alıyoruz. Çocuğunuzun gün boyu rahat edeceği pamuklu ve yüksek dayanıklı Selanik kumaşlarla ürettiğimiz okul kıyafetlerimiz tescilli kaliteden oluşmaktadır.'}
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Standart seri üretimlerden farklı olarak, her bir okul tişörtü, kışlık sweatshirt ve eşofman takımında çocukların günlük hareket temposunu dikkate alıyor; dikişlerin patlamaması için çift kat güçlendirilmiş dikiş iplikleri kullanıyoruz.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Terletmeyen, nefes alabilen %100 Selanik ve üç iplik pamuklu kumaşlar</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Okulların onaylı orijinal nakış ve renk kodları</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Beden değişimi ve paça boyu tadilatında ücretsiz terzilik desteği</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <Image
              src="/images/magaza-vitrin.jpg"
              alt="Esco Okul Kıyafetleri & Erkek Giyim Mağazası"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* PROMOTIONAL SHOWCASE */}
        <div className="space-y-8 bg-slate-900 p-8 sm:p-12 rounded-3xl text-white">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="amber" className="uppercase tracking-widest text-[11px]">
              Örnek Forma Kataloğumuz
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Sezonun Örnek Okul Üniformaları
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Selanik kumaş polo yaka ve eşofman takımlarımız tüm okullarımızın onaylı renk ve amblemlerine uygun olarak hazırlanmaktadır.
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

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Usta İşçilik</h3>
            <p className="text-xs text-slate-500">Yılların birikimi olan kesim ve dikiş kalitesi.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Selanik Kumaş</h3>
            <p className="text-xs text-slate-500">Cilde dost, anti-alerjik %100 pamuklu doku.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Güven & Destek</h3>
            <p className="text-xs text-slate-500">Beden değişimi ve ücretsiz boy tadilatı imkanı.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-slate-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold font-serif">Okul Kıyafetleri & Erkek Giyim Danışmanlığı</h3>
            <p className="text-sm text-slate-300">
              Mağazamızı ziyaret edebilir veya WhatsApp üzerinden doğrudan bilgi alabilirsiniz.
            </p>
          </div>
          <WhatsAppButton
            whatsappNumber={settings?.whatsapp}
            variant="medium"
            label="WhatsApp Danışma Hattı"
          />
        </div>

      </div>
    </div>
  );
}
