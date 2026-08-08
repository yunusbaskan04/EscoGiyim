import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { FaqManager, FaqAdminItem } from '@/components/admin/faq-manager';

export const revalidate = 0;

export default async function AdminFaqPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const faqsDb = await safeQuery(
    () =>
      db.faqItem.findMany({
        orderBy: { sortOrder: 'asc' },
      }),
    []
  );

  const faqs: FaqAdminItem[] = faqsDb.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    sortOrder: f.sortOrder,
    isPublished: f.isPublished,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white">S.S.S Yönetimi</h1>
        <p className="text-xs text-slate-400 mt-1">Müşteri soruları, cevapları ve kategori düzenlemelerini gerçekleştirin.</p>
      </div>

      <FaqManager faqs={faqs} />
    </div>
  );
}
