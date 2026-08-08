'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/audit';

export async function createFaqItem(params: {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  if (!params.question.trim() || !params.answer.trim()) {
    throw new Error('Soru ve cevap alanları zorunludur.');
  }

  const faq = await db.faqItem.create({
    data: {
      question: params.question.trim(),
      answer: params.answer.trim(),
      category: params.category?.trim() || 'Genel',
      sortOrder: params.sortOrder || 0,
      isPublished: true,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'CREATE',
    entityType: 'FAQ',
    entityId: faq.id,
    details: `S.S.S sorusu eklendi: "${faq.question}"`,
  });

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidatePath('/');

  return { success: true, faq };
}

export async function updateFaqItem(
  id: string,
  params: {
    question: string;
    answer: string;
    category?: string;
    sortOrder?: number;
    isPublished: boolean;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const faq = await db.faqItem.update({
    where: { id },
    data: {
      question: params.question.trim(),
      answer: params.answer.trim(),
      category: params.category?.trim() || 'Genel',
      sortOrder: params.sortOrder || 0,
      isPublished: params.isPublished,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'UPDATE',
    entityType: 'FAQ',
    entityId: faq.id,
    details: `S.S.S sorusu güncellendi: "${faq.question}"`,
  });

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidatePath('/');

  return { success: true };
}

export async function deleteFaqItem(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const faq = await db.faqItem.delete({
    where: { id },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'DELETE',
    entityType: 'FAQ',
    entityId: id,
    details: `S.S.S sorusu silindi: "${faq.question}"`,
  });

  revalidatePath('/admin/faq');
  revalidatePath('/faq');
  revalidatePath('/');

  return { success: true };
}
