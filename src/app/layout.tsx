import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Esco Giyim Terzilik & Resmi Okul Kıyafetleri',
  description:
    'Özel dikim terzilik ve resmi okul kıyafetlerinde 30 yılı aşkın tecrübe, pamuklu kaliteli kumaşlar.',
  keywords: [
    'Esco Giyim',
    'Esco Giyim Terzilik',
    'Okul Kıyafetleri',
    'Okul Üniforması',
    'Terzi',
    'Özel Dikim',
    'Polo Tişört',
    'Okul Forması Bitlis',
  ],
  authors: [{ name: 'Esco Giyim Terzilik' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable} overflow-x-hidden max-w-full`} suppressHydrationWarning>
      <body
        className="font-sans antialiased min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden max-w-full"
        suppressHydrationWarning
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
