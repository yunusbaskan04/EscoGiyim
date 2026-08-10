'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shirt, Menu, X, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  phone?: string;
  whatsapp?: string;
  businessName?: string;
}

export function Header({
  phone = '+90 532 313 78 37',
  whatsapp = '905323137837',
  businessName = 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'Okullar & Üniformalar', href: '/schools' },
    { name: 'S.S.S (SSS)', href: '/faq' },
    { name: 'İletişim', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-slate-900/95 text-white backdrop-blur-md dark:border-slate-800">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950 px-3 py-1.5 text-xs text-slate-400 overflow-hidden w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="hidden md:flex items-center gap-2 truncate">
            <Shirt className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Resmi Okul Kıyafetleri & Erkek Giyim | Bitlis</span>
          </div>
          <div className="flex md:hidden items-center gap-1 text-amber-400 font-semibold text-[11px] truncate">
            <Shirt className="h-3 w-3 shrink-0" />
            <span className="truncate">Esco Giyim Bitlis</span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 text-[11px] sm:text-xs">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-amber-400 transition"
            >
              <Phone className="h-3 w-3 shrink-0" />
              <span>{phone}</span>
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition"
            >
              <MessageCircle className="h-3 w-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
            <Shirt className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white font-serif group-hover:text-amber-400 transition">
              ESCO GİYİM
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Okul Kıyafetleri & Erkek Giyim
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                isActive(item.href)
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-amber-400'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-amber-400 transition shadow-sm"
          >
            Bize Ulaşın
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg bg-slate-800 p-2 text-slate-200 hover:bg-slate-700 md:hidden"
            aria-label="Menüyü aç/kapat"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-3 text-base font-medium rounded-xl transition-all',
                  isActive(item.href)
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-amber-400'
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp İletişim</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
