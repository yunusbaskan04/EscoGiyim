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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://escogiyim.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bitlis Okul Forması & Kıyafetleri | Esco Giyim',
    template: '%s | Esco Giyim Bitlis',
  },
  description:
    'Bitlis merkez ve ilçelerindeki tüm ilkokul, ortaokul ve lise resmi okul kıyafetleri, Selahaddin Eyyubi Ortaokulu dahil öğrenci üniformaları ve erkek giyim mağazası.',
  keywords: [
    'Bitlis Okul Forması',
    'Bitlis Okul Kıyafetleri',
    'Esco Giyim Bitlis',
    'Selahaddin Eyyubi Ortaokulu Forması',
    'Bitlis Okul Üniforması',
    'Selanik Kumaş Okul Tişörtü',
    'Bitlis Öğrenci Kıyafetleri',
    'Erkek Giyim Bitlis',
    'Bitlis Terzilik Okul Kıyafeti',
  ],
  authors: [{ name: 'Esco Giyim' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName: 'Esco Giyim Bitlis',
    title: 'Bitlis Okul Forması & Kıyafetleri | Esco Giyim',
    description:
      'Bitlis ilindeki tüm okulların %100 pamuk Selanik kumaş resmi okul kıyafetleri ve üniformaları Esco Giyim mağazamızda.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitlis Okul Forması & Kıyafetleri | Esco Giyim',
    description: 'Bitlis okullarının resmi öğrenci kıyafetleri ve üniformaları.',
  },
  verification: {
    google: 'googled6eef6bc036e6fef',
  },
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Esco Giyim - Bitlis Okul Forması & Erkek Giyim',
    url: siteUrl,
    description:
      'Bitlis merkez ve ilçelerindeki tüm okulların resmi okul kıyafetleri, Selahaddin Eyyubi Ortaokulu dahil öğrenci üniformaları ve erkek giyim.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bitlis',
      addressRegion: 'Bitlis',
      addressCountry: 'TR',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Bitlis',
    },
    priceRange: '₺₺',
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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

