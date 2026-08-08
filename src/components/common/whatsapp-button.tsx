'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  whatsappNumber?: string;
  message?: string;
  label?: string;
  variant?: 'large' | 'medium' | 'small' | 'floating';
  className?: string;
}

export function WhatsAppButton({
  whatsappNumber = '905321234567',
  message = 'Merhaba, okul kıyafetleri ve terzilik hizmetleriniz hakkında bilgi almak istiyorum.',
  label = 'WhatsApp İle İletişime Geçin',
  variant = 'large',
  className,
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(whatsappNumber, message);

  if (variant === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-emerald-600 px-5 py-3.5 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 hover:bg-emerald-500 active:scale-95 group"
        aria-label="WhatsApp Canlı Destek"
      >
        <MessageCircle className="h-6 w-6 fill-current animate-pulse" />
        <span className="font-semibold text-sm hidden md:inline">WhatsApp Bilgi Hattı</span>
      </a>
    );
  }

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs gap-1.5',
    medium: 'px-4 py-2.5 text-sm font-semibold gap-2',
    large: 'w-full px-6 py-4 text-base font-bold gap-3 rounded-xl shadow-lg shadow-emerald-600/20',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-[0.99]',
        sizeClasses[variant],
        className
      )}
    >
      <MessageCircle className="h-5 w-5 shrink-0 fill-current" />
      <span>{label}</span>
    </a>
  );
}
