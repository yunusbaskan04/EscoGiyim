import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, safeQuery } from '@/lib/db';
import { SettingsForm, SiteSettingsData } from '@/components/admin/settings-form';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const defaultSettings = {
    id: 'default',
    businessName: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
    phone: '+90 532 313 78 37',
    whatsapp: '905323137837',
    address: 'ESCO GİYİM, Hüsrev Paşa, Çam sitesi İpek Apt. Altı, Bitlis Merkez / Bitlis',
    mapsEmbedUrl: 'https://www.google.com/maps/embed',
    instagramUrl: 'https://instagram.com/escogiyimokul',
    facebookUrl: 'https://facebook.com/escogiyimokul',
    workingHours: 'Pazartesi - Cumartesi: 08:30 - 19:30',
    heroTitle: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
    heroSubtitle: 'Kaliteli pamuk Selanik kumaş ve usta işçilik',
    aboutTitle: 'Esco Giyim Kalitesi ve Usta İşçilik',
    aboutContent: 'Esco Giyim kalitesi',
    updatedAt: new Date(),
  };

  const settingsDb = await safeQuery(
    () => db.siteSettings.findUnique({ where: { id: 'default' } }),
    defaultSettings
  );

  const active = settingsDb || defaultSettings;

  const settings: SiteSettingsData = {
    businessName: active.businessName,
    phone: active.phone,
    whatsapp: active.whatsapp,
    address: active.address,
    mapsEmbedUrl: active.mapsEmbedUrl,
    instagramUrl: active.instagramUrl,
    facebookUrl: active.facebookUrl,
    workingHours: active.workingHours,
    heroTitle: active.heroTitle,
    heroSubtitle: active.heroSubtitle,
    aboutTitle: active.aboutTitle,
    aboutContent: active.aboutContent,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif text-white">Site Ayarları</h1>
        <p className="text-xs text-slate-400 mt-1">İletişim numaraları, WhatsApp, adres, Google Harita ve ana sayfa başlıklarını düzenleyin.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
