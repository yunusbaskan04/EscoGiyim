'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { GalleryCategory } from '@/types/enums';
import { logActivity } from '@/lib/audit';

export async function createGalleryImage(params: {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  sortOrder?: number;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  if (!params.title || !params.title.trim()) throw new Error('Başlık zorunludur.');
  if (!params.imageUrl) throw new Error('Fotoğraf yüklenmelidir.');

  const item = await db.galleryImage.create({
    data: {
      title: params.title.trim(),
      category: params.category,
      imageUrl: params.imageUrl,
      sortOrder: params.sortOrder || 0,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'CREATE',
    entityType: 'Gallery',
    entityId: item.id,
    details: `Galeriye fotoğraf eklendi: "${item.title}"`,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');

  return { success: true, item };
}

export async function deleteGalleryImage(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const item = await db.galleryImage.delete({
    where: { id },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'DELETE',
    entityType: 'Gallery',
    entityId: id,
    details: `Galeriden fotoğraf silindi: "${item.title}"`,
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');

  return { success: true };
}
