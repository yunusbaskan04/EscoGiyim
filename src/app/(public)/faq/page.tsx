import { db, safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { FaqSearchAccordion, FaqItemData } from '@/components/faq/faq-search-accordion';
import { WhatsAppButton } from '@/components/common/whatsapp-button';

import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `Sıkça Sorulan Sorular - ${settings?.businessName || 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim'}`,
    description: 'Okul kıyafeti bedenleri, Selanik kumaş özellikleri, beden değişimi ve WhatsApp sipariş bilgileri.',
  };
}

export default async function FaqPage() {
  const [settings, faqsFromDb] = await Promise.all([
    getSiteSettings(),
    safeQuery(
      () =>
        db.faqItem.findMany({
          where: { isPublished: true },
          orderBy: { sortOrder: 'asc' },
        }),
      []
    ),
  ]);

  const faqs: FaqItemData[] = faqsFromDb.map((f) => ({
    id: f.id,
    question: f.question.replace(/lakost/gi, 'Selanik'),
    answer: f.answer.replace(/lakost/gi, 'Selanik').replace(/özel ölçü dikim/gi, 'beden seçeneği ve paça tadilatı'),
    category: f.category,
  }));

  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">Destek & Bilgi</Badge>
          <h1 className="text-4xl font-bold font-serif text-slate-900">Sıkça Sorulan Sorular</h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Velilerimizin ve müşterilerimizin okul kıyafetlerimiz, Selanik kumaş kalitemiz, erkek giyim ürünlerimiz ve beden değişimi ile ilgili merak ettiği tüm detaylar.
          </p>
        </div>

        {/* Search & Accordion */}
        <FaqSearchAccordion faqs={faqs} />

        {/* Still have questions banner */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold font-serif">Aradığınız cevabı bulamadınız mı?</h3>
            <p className="text-xs text-slate-300">
              Bize doğrudan WhatsApp üzerinden ulaşıp tüm sorularınızı sorabilirsiniz.
            </p>
          </div>
          <WhatsAppButton
            whatsappNumber={settings?.whatsapp}
            variant="medium"
            label="Doğrudan Bize Yazın"
          />
        </div>
      </div>
    </div>
  );
}
