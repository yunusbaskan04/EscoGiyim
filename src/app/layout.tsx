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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://escogiyim.com.tr';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bitlis Okul Forması & Kıyafetleri | Esco Giyim',
    template: '%s | Esco Giyim Bitlis',
  },
  description:
    'Bitlis merkezdeki tüm ilkokul, ortaokul ve lise resmi okul kıyafetleri, Selahaddin Eyyubi Ortaokulu dahil öğrenci üniformaları ve erkek giyim mağazası.',
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
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: siteUrl,
    siteName: 'Esco Giyim Bitlis',
    title: 'Bitlis Okul Forması & Kıyafetleri | Esco Giyim',
    description:
      'Bitlis ilindeki tüm okulların %100 pamuk Selanik kumaş resmi okul kıyafetleri ve üniformaları Esco Giyim mağazamızda.',
    images: [
      {
        url: `${siteUrl}/images/logo.png`,
        width: 600,
        height: 600,
        alt: 'Esco Giyim Bitlis Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitlis Okul Forması & Kıyafetleri | Esco Giyim',
    description: 'Bitlis okullarının resmi öğrenci kıyafetleri ve üniformaları.',
    images: [`${siteUrl}/images/logo.png`],
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
    alternateName: ['Esco Giyim Bitlis', 'Esco Giyim Okul Kıyafetleri'],
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/logo.png`,
    description:
      'Bitlis merkezdeki tüm ilkokul, ortaokul ve lise resmi okul kıyafetleri, Selahaddin Eyyubi Ortaokulu dahil öğrenci üniformaları ve erkek giyim mağazası.',
    telephone: '+905323137837',
    priceRange: '₺₺',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bitlis',
      addressRegion: 'Bitlis',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '38.4006',
      longitude: '42.1095',
    },
    areaServed: [
      {
        '@type': 'AdministrativeArea',
        name: 'Bitlis Merkez',
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '19:30',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Esco Giyim Ürün ve Hizmet Kataloğu',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Bitlis İlkokul, Ortaokul ve Lise Okul Formaları',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Erkek Giyim & Özel Dikim Hizmetleri',
        },
      ],
    },
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
        <link rel="icon" href="/icon.png" sizes="512x512" type="image/png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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

