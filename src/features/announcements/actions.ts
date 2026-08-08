'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { AnnouncementStatus } from '@/types/enums';
import { logActivity } from '@/lib/audit';

export async function createAnnouncement(params: {
  title: string;
  content: string;
  status: AnnouncementStatus;
  sortOrder?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  if (!params.title.trim() || !params.content.trim()) {
    throw new Error('Başlık ve içerik gereklidir.');
  }

  const announcement = await db.announcement.create({
    data: {
      title: params.title.trim(),
      content: params.content.trim(),
      status: params.status,
      sortOrder: params.sortOrder || 0,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'CREATE',
    entityType: 'Announcement',
    entityId: announcement.id,
    details: `Duyuru yayınlandı: "${announcement.title}"`,
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/admin/dashboard');
  revalidatePath('/');

  return { success: true, announcement };
}

export async function updateAnnouncement(
  id: string,
  params: {
    title: string;
    content: string;
    status: AnnouncementStatus;
    sortOrder?: number;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const announcement = await db.announcement.update({
    where: { id },
    data: {
      title: params.title.trim(),
      content: params.content.trim(),
      status: params.status,
      sortOrder: params.sortOrder || 0,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'UPDATE',
    entityType: 'Announcement',
    entityId: announcement.id,
    details: `Duyuru güncellendi: "${announcement.title}"`,
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/admin/dashboard');
  revalidatePath('/');

  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const announcement = await db.announcement.delete({
    where: { id },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'DELETE',
    entityType: 'Announcement',
    entityId: id,
    details: `Duyuru silindi: "${announcement.title}"`,
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/admin/dashboard');
  revalidatePath('/');

  return { success: true };
}
