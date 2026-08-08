'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateUniqueSlug } from '@/lib/slug';
import { logActivity } from '@/lib/audit';

export async function createSchool(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || '';
  const logoUrl = (formData.get('logoUrl') as string) || null;
  const sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);

  if (!name || !name.trim()) throw new Error('Okul adı zorunludur.');

  const slug = await generateUniqueSlug(name, async (s) => {
    const existing = await db.school.findUnique({ where: { slug: s } });
    return !!existing;
  });

  const newSchool = await db.school.create({
    data: {
      name: name.trim(),
      slug,
      description: description.trim(),
      logoUrl,
      sortOrder,
      isActive: true,
      isDeleted: false,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'CREATE',
    entityType: 'School',
    entityId: newSchool.id,
    details: `Yeni okul oluşturuldu: "${newSchool.name}"`,
  });

  revalidatePath('/admin/schools');
  revalidatePath('/schools');
  revalidatePath('/');

  return { success: true, school: newSchool };
}

export async function updateSchool(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || '';
  const logoUrl = (formData.get('logoUrl') as string) || null;
  const sortOrder = parseInt((formData.get('sortOrder') as string) || '0', 10);
  const isActive = formData.get('isActive') === 'true';

  if (!name || !name.trim()) throw new Error('Okul adı zorunludur.');

  const existingSchool = await db.school.findUnique({ where: { id } });
  if (!existingSchool) throw new Error('Okul bulunamadı.');

  let slug = existingSchool.slug;
  if (existingSchool.name !== name.trim()) {
    slug = await generateUniqueSlug(name, async (s) => {
      const found = await db.school.findFirst({
        where: { slug: s, NOT: { id } },
      });
      return !!found;
    });
  }

  const updatedSchool = await db.school.update({
    where: { id },
    data: {
      name: name.trim(),
      slug,
      description: description.trim(),
      logoUrl,
      sortOrder,
      isActive,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'UPDATE',
    entityType: 'School',
    entityId: updatedSchool.id,
    details: `Okul güncellendi: "${updatedSchool.name}"`,
  });

  revalidatePath('/admin/schools');
  revalidatePath('/schools');
  revalidatePath(`/schools/${updatedSchool.slug}`);
  revalidatePath('/');

  return { success: true, school: updatedSchool };
}

// Requirement #3: Soft Delete for School
export async function softDeleteSchool(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const school = await db.school.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'SOFT_DELETE',
    entityType: 'School',
    entityId: school.id,
    details: `Okul çöp kutusuna taşındı (soft delete): "${school.name}"`,
  });

  revalidatePath('/admin/schools');
  revalidatePath('/schools');
  revalidatePath('/');

  return { success: true };
}

export async function restoreSchool(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const school = await db.school.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'RESTORE',
    entityType: 'School',
    entityId: school.id,
    details: `Okul geri yüklendi: "${school.name}"`,
  });

  revalidatePath('/admin/schools');
  revalidatePath('/schools');
  revalidatePath('/');

  return { success: true };
}

export async function updateSchoolSortOrder(items: { id: string; sortOrder: number }[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  await db.$transaction(
    items.map((item) =>
      db.school.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'REORDER',
    entityType: 'School',
    details: `Okul sıralaması güncellendi.`,
  });

  revalidatePath('/admin/schools');
  revalidatePath('/schools');

  return { success: true };
}
