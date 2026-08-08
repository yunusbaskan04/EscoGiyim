import Image from 'next/image';
import { db, safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { Scissors, CheckCircle2, Award, HeartHandshake, ShieldCheck } from 'lucide-react';

import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Hakkımızda - ${settings?.businessName || 'Esco Giyim Terzilik'}`,
    description: '30 yılı aşkın tecrübemiz, kaliteli kumaş seçimimiz ve kişiye özel terzilik hizmetimiz.',
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col w-full py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">Tarihçemiz & Kalitemiz</Badge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-slate-900 leading-tight tracking-tight">
            {settings?.aboutTitle || 'Hakkımızda & Kalite Anlayışımız'}
          </h1>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            Geleneksel terzilik zanaatımızı modern okul kıyafetleri ile buluşturarak velilerimize ve öğrencilerimize en yüksek konforu sunuyoruz.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-slate-900">
              Usta Terzi İşçiliği ve Dayanıklı Kumaş Seçimi
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {settings?.aboutContent ||
                'Esco Giyim olarak yıllardır özel dikim terzilik ve resmi okul serisi kıyafet tasarımlarında müşteri memnuniyetini esas alıyoruz. Çocuğunuzun gün boyu rahat edeceği pamuklu ve yüksek dayanıklı kumaşlarla ürettiğimiz okul üniformalarımız tescilli kaliteden oluşmaktadır.'}
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Standart seri üretimlerden farklı olarak, her bir okul tişörtü, kışlık sweatshirt ve eşofman takımında çocukların günlük hareket temposunu dikkate alıyor; dikişlerin patlamaması için çift kat güçlendirilmiş dikiş iplikleri kullanıyoruz.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Terletmeyen, nefes alabilen %100 lakost ve üç iplik pamuklu kumaşlar</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Okulların onaylı orijinal nakış ve renk kodları</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0" />
                <span>Özel ölçü almak ve paça boyu tadilatında ücretsiz terzilik desteği</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <Image
              src="/images/magaza-vitrin.jpg"
              alt="Terzi Şah & Esco Okul Kıyafetleri Mağazası"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Usta İşçilik</h3>
            <p className="text-xs text-slate-500">Yılların birikimi olan kesim ve dikiş tecrübesi.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Sağlıklı Kumaş</h3>
            <p className="text-xs text-slate-500">Cilde dost, anti-alerjik yüksek pamuklu dokular.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Scissors className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Özel Ölçü Dikimi</h3>
            <p className="text-xs text-slate-500">Öğrencimizin bedenine özel birebir terzi kalıbı.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900">Güven & Destek</h3>
            <p className="text-xs text-slate-500">Değişim ve ücretsiz boy tadilatı imkanı.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-slate-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold font-serif">Özel Dikim Veya Okul Forması Danışmanlığı</h3>
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
