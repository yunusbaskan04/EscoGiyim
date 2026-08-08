import { cache } from 'react';
import { db, safeQuery } from './db';

export const getSiteSettings = cache(async () => {
  const defaultSettings = {
    id: 'default',
    businessName: 'Esco Giyim Terzilik & Okul Kıyafetleri',
    phone: '+90 532 313 78 37',
    whatsapp: '905323137837',
    address: 'ESCO GİYİM, Hüsrev Paşa, Çam sitesi İpek Apt. Altı, 13000 Bitlis Merkez / Bitlis',
    mapsEmbedUrl: 'https://www.google.com/maps/embed',
    instagramUrl: 'https://instagram.com/escogiyimokul',
    facebookUrl: 'https://facebook.com/escogiyimokul',
    workingHours: 'Pazartesi - Cumartesi: 08:30 - 19:30',
    heroTitle: 'Esco Giyim Terzilik & Resmi Okul Kıyafetleri',
    heroSubtitle: 'Kaliteli Üretim, Uzun Ömürlü, Konforlu! Bitlis ve çevresinde resmi okul üniformalarında tescilli kalite.',
    aboutTitle: 'Esco Giyim Kalitesi ve Usta İşçilik',
    aboutContent: 'Esco Giyim olarak Bitlis ve çevresindeki seçkin okullara özel dikim ve hazır seri okul üniformaları temin etmekteyiz.',
    updatedAt: new Date(),
  };

  const result = await safeQuery(
    () => db.siteSettings.findUnique({ where: { id: 'default' } }),
    defaultSettings
  );

  return result || defaultSettings;
});

export const getActiveAnnouncement = cache(async () => {
  return safeQuery(
    () =>
      db.announcement.findFirst({
        where: { status: 'PUBLISHED' },
        orderBy: { sortOrder: 'asc' },
      }),
    null
  );
});
