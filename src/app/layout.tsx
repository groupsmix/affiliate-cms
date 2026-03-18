import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const font = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const SITE_URL = process.env.SITE_URL || 'https://example.com';
const SITE_NAME = 'أدوات البريد';
const DEFAULT_DESCRIPTION =
  'مراجعات ومقارنات عملية تساعدك تختار أداة النشرات البريدية والتسويق بالإيميل المناسبة لصناع المحتوى العرب';

export const metadata: Metadata = {
  title: {
    default: 'أدوات البريد — أفضل أدوات النشرات البريدية والتسويق بالإيميل',
    template: '%s — أدوات البريد',
  },
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    siteName: SITE_NAME,
    title: 'أدوات البريد — أفضل أدوات النشرات البريدية والتسويق بالإيميل',
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أدوات البريد — أفضل أدوات النشرات البريدية والتسويق بالإيميل',
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={font.className}>{children}</body>
    </html>
  );
}
