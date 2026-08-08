'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity } from '@/lib/audit';

export async function updateSiteSettings(params: {
  businessName: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapsEmbedUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  workingHours: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutContent: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Yetkisiz işlem.');

  const settings = await db.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      businessName: params.businessName.trim(),
      phone: params.phone.trim(),
      whatsapp: params.whatsapp.replace(/[^0-9]/g, ''),
      address: params.address.trim(),
      mapsEmbedUrl: params.mapsEmbedUrl.trim(),
      instagramUrl: params.instagramUrl?.trim() || null,
      facebookUrl: params.facebookUrl?.trim() || null,
      workingHours: params.workingHours.trim(),
      heroTitle: params.heroTitle.trim(),
      heroSubtitle: params.heroSubtitle.trim(),
      aboutTitle: params.aboutTitle.trim(),
      aboutContent: params.aboutContent.trim(),
    },
    create: {
      id: 'default',
      businessName: params.businessName.trim(),
      phone: params.phone.trim(),
      whatsapp: params.whatsapp.replace(/[^0-9]/g, ''),
      address: params.address.trim(),
      mapsEmbedUrl: params.mapsEmbedUrl.trim(),
      instagramUrl: params.instagramUrl?.trim() || null,
      facebookUrl: params.facebookUrl?.trim() || null,
      workingHours: params.workingHours.trim(),
      heroTitle: params.heroTitle.trim(),
      heroSubtitle: params.heroSubtitle.trim(),
      aboutTitle: params.aboutTitle.trim(),
      aboutContent: params.aboutContent.trim(),
    },
  });

  await logActivity({
    adminId: (session.user as { id?: string }).id,
    action: 'SETTINGS_UPDATE',
    entityType: 'Settings',
    entityId: 'default',
    details: 'Site genel ayarları ve iletişim bilgileri güncellendi.',
  });

  revalidatePath('/admin/settings');
  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/contact');

  return { success: true, settings };
}
