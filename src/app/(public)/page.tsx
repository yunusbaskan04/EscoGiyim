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

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings?.businessName || 'Esco Giyim Terzilik'} - Resmi Okul Kıyafetleri & Özel Dikim`,
    description:
      settings?.heroSubtitle ||
      'Bitlis ve çevresinde resmi okul kıyafetleri, özel ölçü terzi dikimi ve pamuklu kumaş üniformalar.',
  };
}

export default async function HomePage() {
  const [settings, schools, faqs] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      () =>
        db.school.findMany({
          where: { isActive: true, isDeleted: false },
          orderBy: { sortOrder: 'asc' },
          take: 6,
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

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 py-20 md:py-28 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-between gap-12">

          <div className="flex flex-col items-start max-w-2xl text-left space-y-5 w-full">
            <Badge variant="amber" className="px-3 py-1 text-[11px] sm:text-xs uppercase tracking-widest gap-1.5 max-w-full truncate">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Geleneksel Ustalık & Modern Çizgi</span>
            </Badge>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight break-words max-w-full">
              {settings?.heroTitle || 'Esco Giyim Terzilik & Resmi Okul Kıyafetleri'}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed break-words max-w-full">
              {settings?.heroSubtitle ||
                '30 yılı aşkın tecrübemizle resmi okul üniformalarında ve kişiye özel terzi dikimlerinde kaliteli kumaş, mükemmel kalıp ve dayanıklılık sunuyoruz.'}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <Link href="/schools" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold gap-2 text-sm sm:text-base shadow-lg shadow-amber-500/20">
                  <GraduationCap className="h-5 w-5" />
                  <span>Okul Formalarını İncele</span>
                </Button>
              </Link>

              <div className="w-full sm:w-auto">
                <WhatsAppButton
                  whatsappNumber={settings?.whatsapp}
                  variant="medium"
                  label="WhatsApp Danışma Hattı"
                  message="Merhaba, Esco Giyim web sitenizden ulaşıyorum. Okul formaları hakkında bilgi almak istiyorum."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-6 border-t border-slate-800/80 w-full text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>%100 Pamuk Kumaş</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Özel Ölçü Dikimi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Ücretsiz Tadilat</span>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-md lg:max-w-none lg:w-1/2 flex justify-center">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800/80 bg-slate-800">
              <Image
                src="/images/magaza-dis.jpg"
                alt="Terzi Giyim & Esco Okul Kıyafetleri Mağaza Vitrini"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* BUSINESS INTRODUCTION */}
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
              <Badge variant="amber" className="w-fit">Hakkımızda</Badge>
              <h2 className="text-3xl font-bold font-serif text-slate-900 leading-tight">
                {settings?.aboutTitle || 'Esco Giyim Terzilik & Üniforma Kalitesi'}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {settings?.aboutContent ||
                  'Esco Giyim olarak uzun yıllardır okul üniformaları ve kişiye özel terzi dikimlerinde kaliteyi ön planda tutuyoruz.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-2xl font-black text-amber-600 font-serif">30+ Yıl</span>
                  <p className="text-xs text-slate-600 font-medium">Sektörel Terzilik Tecrübesi</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-2xl font-black text-amber-600 font-serif">100%</span>
                  <p className="text-xs text-slate-600 font-medium">Müşteri ve Veli Memnuniyeti</p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/about">
                  <Button variant="outline" className="gap-2 text-sm font-semibold">
                    <span>Hakkımızda Detaylı Bilgi</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SCHOOLS */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="amber">Anlaşmalı Okullar</Badge>
              <h2 className="text-3xl font-bold font-serif text-slate-900">
                Resmi Okul Üniformalarımız
              </h2>
              <p className="text-slate-600 text-sm max-w-xl">
                Bölgemizdeki seçkin okulların orijinal renk, amblem ve kalıplarına uygun üretilen kıyafetleri inceleyebilirsiniz.
              </p>
            </div>

            <Link href="/schools">
              <Button variant="outline" className="gap-2 font-semibold">
                <span>Tüm Okulları Gör ({schools.length})</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Card key={school.id} className="group flex flex-col justify-between overflow-hidden border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative h-48 w-full bg-slate-200 overflow-hidden shrink-0">
                  <Image
                    src={school.logoUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80'}
                    alt={school.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="default" className="shadow-md font-bold">
                      {school._count.products} Kıyafet Çeşidi
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-serif text-slate-900 group-hover:text-amber-600 transition leading-snug line-clamp-2 min-h-[3.25rem]">
                      {school.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed min-h-[2.25rem]">
                      {school.description || 'Resmi okul üniformaları, polo tişörtler ve kışlık sweatshirt modelleri.'}
                    </p>
                  </div>

                  <Link href={`/schools/${school.slug}`} className="block pt-2 mt-auto">
                    <Button variant="primary" className="w-full justify-between group-hover:bg-amber-500 group-hover:text-slate-950 transition font-bold">
                      <span>Kıyafetleri İncele</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
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
