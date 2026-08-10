import Link from 'next/link';
import Image from 'next/image';
import { db, safeQuery } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AccordionItem } from '@/components/ui/accordion';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import {
  Scissors,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Camera,
  Shirt,
  HeartHandshake,
} from 'lucide-react';

import { getSiteSettings } from '@/lib/data';
import { SchoolsSearchGrid, SchoolItemData } from '@/components/schools/schools-search-grid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings?.businessName || 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim'} - Bitlis`,
    description:
      settings?.heroSubtitle ||
      'Bitlis ve çevresinde resmi okul üniformaları, Selanik kumaş polo tişörtler, kışlık sweatshirt modelleri ve erkek giyim ürünleri.',
  };
}

export default async function HomePage() {
  const [settings, schoolsFromDb, faqs] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      () =>
        db.school.findMany({
          where: { isActive: true, isDeleted: false },
          orderBy: { sortOrder: 'asc' },
        }),
      []
    ),
    safeQuery(
      () =>
        db.faqItem.findMany({
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
          take: 4,
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
    { url: '/images/reklam/ornek-forma-1.jpg', title: 'Beyaz Temalı Öğrenci Üniforma Modeli', tag: 'Selanik Kumaş' },
    { url: '/images/reklam/ornek-forma-2.jpg', title: 'Turuncu Temalı Öğrenci Üniforma Modeli', tag: 'Özel Renk Serisi' },
    { url: '/images/reklam/ornek-forma-3.jpg', title: 'Yeşil Temalı Öğrenci Üniforma Modeli', tag: '%100 Pamuk Dokusu' },
    { url: '/images/reklam/ornek-forma-4.jpg', title: 'Bordo Temalı Öğrenci Üniforma Modeli', tag: 'Dayanıklı Dikiş' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-24 text-white border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-between gap-10">

          <div className="flex flex-col items-start max-w-2xl text-left space-y-5 w-full">
            <Badge variant="amber" className="px-3.5 py-1.5 text-[11px] sm:text-xs uppercase tracking-widest gap-2 max-w-full truncate font-bold">
              <GraduationCap className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="truncate">Bitlis & Çevresi Okul Kıyafetleri & Erkek Giyim</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight break-words max-w-full">
              ESCO GİYİM - Okul Kıyafetleri
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed break-words max-w-full">
              Anlaşmalı tüm ilkokul, ortaokul ve liselerimizin onaylı nakış amblemli Selanik kumaş polo yaka tişört, kışlık sweatshirt, eşofman takımları ve şık erkek giyim ürünleri tek adreste.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <a href="#okullar" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold gap-2 text-base shadow-xl shadow-amber-500/20 py-6">
                  <GraduationCap className="h-5 w-5" />
                  <span>Anlaşmalı Okulları Gör</span>
                </Button>
              </a>

              <div className="w-full sm:w-auto">
                <WhatsAppButton
                  whatsappNumber={settings?.whatsapp}
                  variant="medium"
                  label="WhatsApp Sipariş & Bilgi"
                  message="Merhaba, Esco Giyim web sitenizden ulaşıyorum. Okul kıyafetleri ve erkek giyim ürünleri hakkında bilgi almak istiyorum."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-6 border-t border-slate-800/80 w-full text-slate-300 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>%100 Pamuk Selanik Kumaş</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Orijinal Okul Amblemleri</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Erkek Giyim Serisi</span>
              </div>
            </div>
          </div>

          {/* HERO PROMOTIONAL PHOTO SHOWCASE */}
          <div className="relative w-full max-w-md lg:max-w-none lg:w-1/2 flex justify-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-800">
              <Image
                src="/images/reklam/ornek-forma-1.jpg"
                alt="Esco Giyim Örnek Okul Üniformaları"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-white">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Yüksek Kalite Pamuk</span>
                  <span className="font-serif font-bold text-sm">Selanik Kumaş Okul Kıyafetleri</span>
                </div>
                <Shirt className="h-7 w-7 text-amber-500 shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INFORMATIONAL SCHOOL LISTING & SEARCH */}
      <section id="okullar" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="amber">Kıyafeti Tedarik Edilen Okullar</Badge>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">
                Anlaşmalı Okul Listemiz
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl">
                Aşağıda resmi Selanik kumaş tişört, kışlık sweatshirt ve eşofman takımlarını mağazamızdan temin edebileceğiniz okullarımızın bilgilendirme amaçlı listesi yer almaktadır.
              </p>
            </div>
          </div>

          {/* DATABASE SCHOOLS LIVE SEARCH GRID */}
          <SchoolsSearchGrid
            schools={schoolItems}
            whatsappNumber={settings?.whatsapp || '905323137837'}
          />
        </div>
      </section>

      {/* PROMOTIONAL STUDENT UNIFORMS SHOWCASE */}
      <section className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="amber" className="w-fit mx-auto uppercase tracking-widest text-[11px]">
              Örnek Forma Koleksiyonumuz
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white">
              Resmi Okul Üniforma & Polo Tişört Modellerimiz
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Öğrencilerimiz için özel dokunan %100 pamuk Selanik kumaşlar, solmayan renkler ve okul onaylı orijinal nakış logolu üniforma serimiz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl bg-slate-800 border border-slate-700/80 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-amber-500/10"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={img.url}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-90" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                      {img.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 space-y-1 text-white">
                    <h3 className="font-serif font-bold text-base leading-snug">{img.title}</h3>
                    <p className="text-[11px] text-slate-300 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      <span>Resmi Okul Kıyafet Standardı</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK CONTACT BANNER */}
      <section className="py-10 bg-amber-500 text-slate-950 border-b border-amber-600">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold font-serif">Aradığınız Okulu Bulamadınız mı veya Beden Danışmak mı İstiyorsunuz?</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-900/80">Müşteri temsilcilerimiz telefon veya WhatsApp hattında size anında yardımcı olur.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${(settings?.phone || '05323137837').replace(/\s+/g, '')}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-950 text-amber-400 font-bold text-sm hover:bg-slate-900 transition shadow-lg"
            >
              <Phone className="h-4 w-4" />
              <span>{settings?.phone || '0532 313 78 37'}</span>
            </a>
            <WhatsAppButton
              whatsappNumber={settings?.whatsapp}
              variant="medium"
              label="WhatsApp Sipariş"
            />
          </div>
        </div>
      </section>

      {/* SECONDARY ABOUT BANNER */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <Image
                src="/images/magaza-vitrin.jpg"
                alt="Esco Giyim Mağaza Girişi"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col space-y-6">
              <Badge variant="amber" className="w-fit">Kalite & Güvence</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
                {settings?.aboutTitle || 'Esco Giyim Kalitesi ve Usta İşçilik'}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {settings?.aboutContent ||
                  'Esco Giyim olarak uzun yıllardır okul üniformalarında ve erkek giyim ürünlerinde kaliteyi ön planda tutuyoruz. Terletmeyen pamuklu Selanik kumaşlarımız ve ücretsiz paça tadilatı olanağımız ile hizmetinizdeyiz.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 font-serif">Ücretsiz</span>
                  <p className="text-xs text-slate-600 font-medium">Paça Boyu Tadilatı</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 font-serif">Selanik</span>
                  <p className="text-xs text-slate-600 font-medium">%100 Pamuk Kumaş Kalitesi</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" className="gap-2 text-sm font-semibold">
                    <span>Mağazamızı ve Hakkımızda Sayfasını İnceleyin</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="amber">Neden Esco Giyim?</Badge>
            <h2 className="text-3xl font-bold font-serif text-slate-900">
              Veli ve Öğrencilerimizin Tercih Sebepleri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 flex flex-col space-y-4 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Sınıf Selanik Kumaş</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yıkamalara dayanıklı, terletmeyen, alerji yapmayan ve renk atmayan pamuklu Selanik doku.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 flex flex-col space-y-4 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Beden & Paça Tadilatı</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Öğrencilerimize en uygun beden seçimi ve mağazamızda ücretsiz paça ve boy tadilatı hizmeti.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-200/80 flex flex-col space-y-4 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Orijinal Okul Amblemleri</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Okulların resmi renk kodlarına ve onaylı amblem standartlarına %100 birebir uyumlu nakışlar.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* FAQ PREVIEW */}
      {faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-4xl px-4 space-y-8">
            <div className="text-center space-y-3">
              <Badge variant="amber">Sıkça Sorulan Sorular</Badge>
              <h2 className="text-3xl font-bold font-serif text-slate-900">Merak Edilenler</h2>
            </div>

            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link href="/faq">
                <Button variant="ghost" className="gap-2 font-semibold text-amber-600 hover:text-amber-700">
                  <HelpCircle className="h-4 w-4" />
                  <span>Tüm Soruları İnceleyin</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT CTA & MAPS PREVIEW */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="amber">İletişime Geçin</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
              Sorularınız ve Sipariş Danışmanlığı İçin Ulaşın
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
                <Phone className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Telefon</span>
                  <span className="font-bold text-slate-900">{settings?.phone || '+90 532 123 45 67'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
                <MapPin className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Adres</span>
                  <span className="font-medium text-slate-800">{settings?.address || 'İstanbul'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <WhatsAppButton
                whatsappNumber={settings?.whatsapp}
                variant="large"
                label="WhatsApp İle Sorun & Bilgi Alın"
              />
            </div>
          </div>

          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <iframe
              src={settings?.mapsEmbedUrl || 'https://www.google.com/maps/embed'}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Esco Giyim Google Harita"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
