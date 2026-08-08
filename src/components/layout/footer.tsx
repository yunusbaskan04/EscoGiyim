import Link from 'next/link';
import { Scissors, MapPin, Phone, MessageCircle, Clock, Lock } from 'lucide-react';
import { formatExternalUrl } from '@/lib/utils';

interface FooterProps {
  businessName?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  workingHours?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export function Footer({
  businessName = 'Esco Giyim Terzilik & Okul Kıyafetleri',
  phone = '+90 532 313 78 37',
  whatsapp = '905323137837',
  address = 'Hüsrev Paşa, Çam sitesi İpek Apt. Altı, Bitlis Merkez / Bitlis',
  workingHours = 'Pazartesi - Cumartesi: 08:30 - 19:30',
  instagramUrl = 'https://instagram.com/escogiyimokul',
  facebookUrl = 'https://facebook.com/escogiyimokul',
}: FooterProps) {
  const formattedInstagram = formatExternalUrl(instagramUrl);
  const formattedFacebook = formatExternalUrl(facebookUrl);

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold">
                <Scissors className="h-5 w-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">ESCO GİYİM</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              30 yılı aşkın terzilik tecrübesi, kaliteli özel dikim hizmetleri ve anlaşmalı resmi okul kıyafetlerinde tescilli marka.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {formattedInstagram && (
                <a
                  href={formattedInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {formattedFacebook && (
                <a
                  href={formattedFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-slate-900 p-2 text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                  </svg>
                </a>
              )}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-slate-900 p-2 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">Hakkımızda</Link>
              </li>
              <li>
                <Link href="/schools" className="hover:text-amber-400 transition">Okullar & Üniformalar</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition">Sıkça Sorulan Sorular</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">İletişim & Konum</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">İletişim Bilgileri</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-amber-400 transition">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition"
                >
                  WhatsApp Bilgi Hattı
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Working Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">Çalışma Saatleri</h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{workingHours}</span>
            </div>
            <div className="mt-4 pt-2">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition"
              >
                <Lock className="h-3 w-3" />
                <span>Yönetici Girişi</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p suppressHydrationWarning>© {new Date().getFullYear()} {businessName}. Tüm Hakları Saklıdır.</p>
          <p>E-ticaret ve online ödeme sistemi bulunmamaktadır. Bilgilendirme ve katalog tanıtım sitesidir.</p>
        </div>
      </div>
    </footer>
  );
}
