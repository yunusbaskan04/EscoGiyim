'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettings } from '@/features/settings/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Save, MapPin, Phone, MessageCircle, Clock, Sparkles } from 'lucide-react';

export interface SiteSettingsData {
  businessName: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapsEmbedUrl: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  workingHours: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutContent: string;
}

interface SettingsFormProps {
  settings: SiteSettingsData;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  const [businessName, setBusinessName] = React.useState(settings.businessName);
  const [phone, setPhone] = React.useState(settings.phone);
  const [whatsapp, setWhatsapp] = React.useState(settings.whatsapp);
  const [address, setAddress] = React.useState(settings.address);
  const [mapsEmbedUrl, setMapsEmbedUrl] = React.useState(settings.mapsEmbedUrl);
  const [instagramUrl, setInstagramUrl] = React.useState(settings.instagramUrl || '');
  const [facebookUrl, setFacebookUrl] = React.useState(settings.facebookUrl || '');
  const [workingHours, setWorkingHours] = React.useState(settings.workingHours);

  const [heroTitle, setHeroTitle] = React.useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = React.useState(settings.heroSubtitle);
  const [aboutTitle, setAboutTitle] = React.useState(settings.aboutTitle);
  const [aboutContent, setAboutContent] = React.useState(settings.aboutContent);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      await updateSiteSettings({
        businessName,
        phone,
        whatsapp,
        address,
        mapsEmbedUrl,
        instagramUrl,
        facebookUrl,
        workingHours,
        heroTitle,
        heroSubtitle,
        aboutTitle,
        aboutContent,
      });

      setSuccessMsg('Site ayarları başarıyla güncellendi.');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Güncelleme hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {successMsg && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Contact & Socials */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
          <Phone className="h-5 w-5 text-amber-500" />
          <span>İletişim & Sosyal Medya Bilgileri</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">İşletme Adı</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Telefon Numarası</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">WhatsApp Numarası (Ülke Kodu İle)</label>
            <Input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
              placeholder="905321234567"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Çalışma Saatleri</label>
            <Input
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="font-semibold text-slate-300">Açık Adres</label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="font-semibold text-slate-300">Google Maps Embed iframe URL</label>
            <Input
              value={mapsEmbedUrl}
              onChange={(e) => setMapsEmbedUrl(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Instagram Bağlantısı</label>
            <Input
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Facebook Bağlantısı</label>
            <Input
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Homepage Content */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <span>Ana Sayfa & Hakkımızda Metinleri</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Hero Başlık</label>
            <Input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Hero Alt Yazı</label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Hakkımızda Başlık</label>
            <Input
              value={aboutTitle}
              onChange={(e) => setAboutTitle(e.target.value)}
              className="bg-slate-950 border-slate-800 text-white font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Hakkımızda Metin İçeriği</label>
            <textarea
              rows={4}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-white focus:ring-2 focus:ring-amber-500 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold h-12 px-8 text-sm gap-2 shadow-lg shadow-amber-500/10"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
        </Button>
      </div>
    </form>
  );
}
