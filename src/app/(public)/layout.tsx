import React from 'react';
import { db, safeQuery } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnnouncementBanner } from '@/components/common/announcement-banner';
import { WhatsAppButton } from '@/components/common/whatsapp-button';

import { getSiteSettings, getActiveAnnouncement } from '@/lib/data';

export const revalidate = 60;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [activeSettings, activeAnnouncement] = await Promise.all([
    getSiteSettings(),
    getActiveAnnouncement(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      <AnnouncementBanner announcement={activeAnnouncement} />
      <Header
        phone={activeSettings.phone}
        whatsapp={activeSettings.whatsapp}
        businessName={activeSettings.businessName}
      />
      <main className="flex-1">{children}</main>
      <WhatsAppButton
        variant="floating"
        whatsappNumber={activeSettings.whatsapp}
        message="Merhaba, Esco Giyim web siteniz üzerinden ulaştım. Bilgi almak istiyorum."
      />
      <Footer
        businessName={activeSettings.businessName}
        phone={activeSettings.phone}
        whatsapp={activeSettings.whatsapp}
        address={activeSettings.address}
        workingHours={activeSettings.workingHours}
        instagramUrl={activeSettings.instagramUrl || undefined}
        facebookUrl={activeSettings.facebookUrl || undefined}
      />
    </div>
  );
}
