import { db, safeQuery } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { formatExternalUrl } from '@/lib/utils';

import { getSiteSettings } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `İletişim & Konum - ${settings?.businessName || 'Esco Giyim Terzilik'}`,
    description: 'Telefon, WhatsApp, adres, çalışma saatleri ve Google Harita konumu.',
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const formattedInstagram = formatExternalUrl(settings?.instagramUrl || 'https://instagram.com/escogiyimokul');
  const formattedFacebook = formatExternalUrl(settings?.facebookUrl || 'https://facebook.com/escogiyimokul');

  return (
    <div className="flex flex-col w-full py-12 md:py-20 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="amber">Bize Ulaşın</Badge>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">İletişim & Mağaza Konumu</h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Okul kıyafeti almak, ölçü yaptırmak veya bilgi edinmek için magazamızı ziyaret edebilir veya iletişim hatlarımızdan bize ulaşabilirsiniz.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Phone */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Telefon</h3>
            <p className="text-xs text-slate-500">Çalışma saatleri içinde doğrudan arayın.</p>
            <a
              href={`tel:${(settings?.phone || '+90 532 123 45 67').replace(/\s+/g, '')}`}
              className="text-sm font-bold text-amber-600 hover:underline block"
            >
              {settings?.phone || '+90 532 123 45 67'}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">WhatsApp Hattı</h3>
            <p className="text-xs text-slate-500">7/24 mesaj bırakabilirsiniz.</p>
            <a
              href={`https://wa.me/${settings?.whatsapp || '905321234567'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-emerald-600 hover:underline block"
            >
              WhatsApp Mesaj Gönder
            </a>
          </div>

          {/* Address */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Mağaza Adresi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings?.address || 'Fevzi Çakmak Mah. İstanbul Cad. No:42/A, Pendik / İstanbul'}
            </p>
          </div>

          {/* Hours */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Çalışma Saatleri</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings?.workingHours || 'Pazartesi - Cumartesi: 08:30 - 19:30'}
            </p>
          </div>

        </div>

        {/* Interactive Map & Direct Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl">
            <h3 className="text-2xl font-bold font-serif text-white">Hızlı Erişim & İletişim</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esco Giyim mağazamızda okul önlükleri, polo yaka tişörtler, ceketler ve eşofman serilerini deneyebilir; paça boyu tadilatınızı hemen yaptırabilirsiniz.
            </p>

            <div className="space-y-4 pt-2">
              <WhatsAppButton
                whatsappNumber={settings?.whatsapp}
                variant="large"
                label="WhatsApp Canlı Danışma"
              />

              <a
                href={`tel:${(settings?.phone || '+90 532 123 45 67').replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 py-3.5 text-sm font-bold text-white transition"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                <span>Telefon İle Arayın</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-4">
              <span className="text-xs text-slate-400 font-semibold">Sosyal Medya:</span>
              {formattedInstagram && (
                <a href={formattedInstagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-amber-400 transition" aria-label="Instagram">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {formattedFacebook && (
                <a href={formattedFacebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:text-amber-400 transition" aria-label="Facebook">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-200">
            <iframe
              src={settings?.mapsEmbedUrl || 'https://www.google.com/maps/embed'}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Esco Giyim Mağaza Konumu"
            />
          </div>

        </div>

      </div>
    </div>
  );
}
