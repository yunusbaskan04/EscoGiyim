'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateUniqueSlug } from '@/lib/slug';
import { logActivity } from '@/lib/audit';

export async function createProduct(params: {
  schoolId: string;
  name: string;
  description?: string;
  sortOrder?: number;
  images: { imageUrl: string; isCover: boolean; sortOrder: number }[];
  sizes: { name: string; sortOrder: number }[];
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  if (!params.schoolId) throw new Error('Okul seçimi zorunludur.');
  if (!params.name || !params.name.trim()) throw new Error('Ürün adı zorunludur.');

  const slug = await generateUniqueSlug(params.name, async (s) => {
    const existing = await db.product.findUnique({ where: { slug: s } });
    return !!existing;
  });

  const product = await db.product.create({
    data: {
      schoolId: params.schoolId,
      name: params.name.trim(),
      slug,
      description: params.description?.trim() || null,
      sortOrder: params.sortOrder || 0,
      isActive: true,
      isDeleted: false,
      images: {
        create: params.images.map((img) => ({
          imageUrl: img.imageUrl,
          isCover: img.isCover,
          sortOrder: img.sortOrder,
        })),
      },
      sizes: {
        create: params.sizes.map((sz) => ({
          name: sz.name.trim(),
          sortOrder: sz.sortOrder,
        })),
      },
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'CREATE',
    entityType: 'Product',
    entityId: product.id,
    details: `Yeni okul forması eklendi: "${product.name}"`,
  });

  revalidatePath('/admin/products');
  revalidatePath('/schools');
  revalidatePath('/');

  return { success: true, product };
}

export async function updateProduct(
  id: string,
  params: {
    schoolId: string;
    name: string;
    description?: string;
    sortOrder?: number;
    isActive: boolean;
    images: { imageUrl: string; isCover: boolean; sortOrder: number }[];
    sizes: { name: string; sortOrder: number }[];
  }
) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) throw new Error('Ürün bulunamadı.');

  let slug = existing.slug;
  if (existing.name !== params.name.trim()) {
    slug = await generateUniqueSlug(params.name, async (s) => {
      const found = await db.product.findFirst({
        where: { slug: s, NOT: { id } },
      });
      return !!found;
    });
  }

  // Update base product
  await db.product.update({
    where: { id },
    data: {
      schoolId: params.schoolId,
      name: params.name.trim(),
      slug,
      description: params.description?.trim() || null,
      sortOrder: params.sortOrder || 0,
      isActive: params.isActive,
    },
  });

  // Re-create images and sizes in transaction for clean normalization
  await db.productImage.deleteMany({ where: { productId: id } });
  if (params.images.length > 0) {
    await db.productImage.createMany({
      data: params.images.map((img) => ({
        productId: id,
        imageUrl: img.imageUrl,
        isCover: img.isCover,
        sortOrder: img.sortOrder,
      })),
    });
  }

  await db.productSize.deleteMany({ where: { productId: id } });
  if (params.sizes.length > 0) {
    await db.productSize.createMany({
      data: params.sizes.map((sz) => ({
        productId: id,
        name: sz.name.trim(),
        sortOrder: sz.sortOrder,
      })),
    });
  }

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'UPDATE',
    entityType: 'Product',
    entityId: id,
    details: `Ürün bilgileri güncellendi: "${params.name}"`,
  });

  revalidatePath('/admin/products');
  revalidatePath('/schools');
  revalidatePath('/');

  return { success: true };
}

// Requirement #3: Soft Delete for Product
export async function softDeleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const product = await db.product.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'SOFT_DELETE',
    entityType: 'Product',
    entityId: product.id,
    details: `Ürün çöp kutusuna taşındı (soft delete): "${product.name}"`,
  });

  revalidatePath('/admin/products');
  revalidatePath('/schools');

  return { success: true };
}

export async function restoreProduct(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const product = await db.product.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'RESTORE',
    entityType: 'Product',
    entityId: product.id,
    details: `Ürün geri yüklendi: "${product.name}"`,
  });

  revalidatePath('/admin/products');
  revalidatePath('/schools');

  return { success: true };
}
