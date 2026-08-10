import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Esco Giyim - Okul Kıyafetleri & Erkek Giyim',
  description:
    'Resmi okul kıyafetleri, öğrenci üniformaları ve erkek giyimde yüksek kalite %100 pamuk Selanik kumaşlar.',
  keywords: [
    'Esco Giyim',
    'Okul Kıyafetleri',
    'Erkek Giyim',
    'Okul Üniforması',
    'Selanik Kumaş Polo Tişört',
    'Okul Forması Bitlis',
  ],
  authors: [{ name: 'Esco Giyim' }],
  other: {
    'color-scheme': 'light only',
    'supported-color-schemes': 'light',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${outfit.variable} overflow-x-hidden max-w-full light`}
      style={{ colorScheme: 'light' }}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden max-w-full"
        suppressHydrationWarning
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
