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
} from 'lucide-react';

import { getSiteSettings } from '@/lib/data';
import { ProductCatalogGrid, ProductCatalogItem, SchoolFilterOption } from '@/components/products/product-catalog-grid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings?.businessName || 'Esco Giyim Terzilik'} - Resmi Okul Kıyafetleri & Üniformalar`,
    description:
      settings?.heroSubtitle ||
      'Bitlis ve çevresinde resmi okul üniformaları, polo tişörtler, kışlık sweatshirt modelleri ve eşofman takımları.',
  };
}

export default async function HomePage() {
  const [settings, productsFromDb, schoolsFromDb, faqs] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      () =>
        db.product.findMany({
          where: { isActive: true, isDeleted: false },
          orderBy: { updatedAt: 'desc' },
          include: {
            school: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { sortOrder: 'asc' } },
            sizes: { orderBy: { sortOrder: 'asc' } },
          },
        }),
      []
    ),
    safeQuery(
      () =>
        db.school.findMany({
          where: { isActive: true, isDeleted: false },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: { products: { where: { isActive: true, isDeleted: false } } },
            },
          },
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

  const catalogProducts: ProductCatalogItem[] = (productsFromDb as any[]).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    schoolId: p.school.id,
    schoolName: p.school.name,
    schoolSlug: p.school.slug,
    images: (p.images || []).map((img: any) => ({ id: img.id, url: img.imageUrl, isCover: img.isCover })),
    sizes: (p.sizes || []).map((sz: any) => ({ id: sz.id, name: sz.name })),
  }));

  const schoolFilters: SchoolFilterOption[] = (schoolsFromDb as any[]).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    productCount: s._count?.products || 0,
  }));

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION - SCHOOL UNIFORMS FOCUS */}
      <section className="relative overflow-hidden bg-slate-900 py-16 md:py-24 text-white border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-between gap-10">

          <div className="flex flex-col items-start max-w-2xl text-left space-y-5 w-full">
            <Badge variant="amber" className="px-3.5 py-1.5 text-[11px] sm:text-xs uppercase tracking-widest gap-2 max-w-full truncate font-bold">
              <GraduationCap className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="truncate">Bitlis & Çevresi Resmi Okul Üniformaları</span>
            </Badge>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight break-words max-w-full">
              Esco Giyim Resmi Okul Üniformaları & Kıyafetleri
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed break-words max-w-full">
              Anlaşmalı tüm ilkokul, ortaokul ve liselerimizin onaylı nakış amblemli polo yaka tişört, kışlık sweatshirt, eşofman takımı ve resmi okul formaları tek adreste.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <a href="#okullar" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-400 font-extrabold gap-2 text-base shadow-xl shadow-amber-500/20 py-6">
                  <GraduationCap className="h-5 w-5" />
                  <span>Okulunu Seç & Kıyafetleri Gör</span>
                </Button>
              </a>

              <div className="w-full sm:w-auto">
                <WhatsAppButton
                  whatsappNumber={settings?.whatsapp}
                  variant="medium"
                  label="WhatsApp Sipariş & Bilgi"
                  message="Merhaba, Esco Giyim web sitenizden ulaşıyorum. Okul formaları hakkında bilgi almak istiyorum."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-6 border-t border-slate-800/80 w-full text-slate-300 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>%100 Pamuk Lakost Kumaş</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Orijinal Okul Amblemleri</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Her Beden Mevcut</span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-md lg:max-w-none lg:w-1/2 flex justify-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-800">
              <Image
                src="/images/magaza-dis.jpg"
                alt="Esco Giyim Resmi Okul Üniformaları Vitrini"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-white">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">Bitlis Okul Kıyafetlerinde</span>
                  <span className="font-serif font-bold text-sm">Resmi & Tescilli Üretim Kalitesi</span>
                </div>
                <Shirt className="h-7 w-7 text-amber-500 shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED UNIFORM PRODUCTS & SCHOOL FILTER CATALOG */}
      <section id="katalog" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="amber">Üniforma Kataloğu</Badge>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">
                Tüm Okul Üniformalarımız ve Modeller
              </h2>
              <p className="text-slate-600 text-sm max-w-2xl">
                Aşağıda bölgemizdeki okulların resmi polo yaka tişört, sweatshirt, pantolon ve eşofman modelleri doğrudan listelenmektedir. Okul ismine tıklayarak anında filtreleyebilir, fotoğrafları büyütebilir ve WhatsApp'tan sipariş verebilirsiniz.
              </p>
            </div>
          </div>

          {/* TRENDYOL-STYLE PRODUCT CATALOG GRID */}
          <ProductCatalogGrid
            products={catalogProducts}
            schools={schoolFilters}
            whatsappNumber={settings?.whatsapp || '905323137837'}
          />
        </div>
      </section>

      {/* QUICK CONTACT BANNER */}
      <section className="py-10 bg-amber-500 text-slate-950 border-b border-amber-600">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold font-serif">Aradığınız Okulu Bulamadınız mı veya Beden Danışmak mı İstiyorsunuz?</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-900/80">Usta terzilerimiz ve müşteri temsilcilerimiz telefon veya WhatsApp hattında size anında yardımcı olur.</p>
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

      {/* SECONDARY TAILORING & ABOUT BANNER */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <Image
                src="/images/magaza-vitrin.jpg"
                alt="Esco Giyim Terzilik Mağaza Girişi"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col space-y-6">
              <Badge variant="amber" className="w-fit">Terzilik & Güvence</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
                {settings?.aboutTitle || 'Esco Giyim Terzilik & Üniforma Kalitesi'}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {settings?.aboutContent ||
                  'Esco Giyim olarak uzun yıllardır okul üniformalarında kaliteyi ön planda tutuyoruz. Standart beden harici özel dikim ihtiyacı olan öğrencilerimiz için usta terzi işçiliğimiz ve ücretsiz paça tadilatı olanağımız mevcuttur.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 font-serif">Ücretsiz</span>
                  <p className="text-xs text-slate-600 font-medium">Paça Boyu Tadilatı</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-600 font-serif">Özel Ölçü</span>
                  <p className="text-xs text-slate-600 font-medium">Terzi Dikim Hizmeti</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" className="gap-2 text-sm font-semibold">
                    <span>Terzilik & Mağazamızı İnceleyin</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="amber">Neden Esco Giyim?</Badge>
            <h2 className="text-3xl font-bold font-serif text-slate-900">
              Veli ve Öğrencilerimizin Tercih Sebepleri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-4 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Kaliteli Pamuklu Kumaş</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yıkamalara dayanıklı, terletmeyen, alerji yapmayan ve renk atmayan 1. sınıf kumaş dokusu.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-4 hover:shadow-lg transition">
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Scissors className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Özel Ölçü Dikim & Tadilat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Standart beden kalıbına uymayan öğrenciler için usta terzi dikimi ve ücretsiz paça tadilatı.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col space-y-4 hover:shadow-lg transition">
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
