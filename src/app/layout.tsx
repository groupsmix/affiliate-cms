import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';

const font = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'أدوات البريد — أفضل أدوات النشرات البريدية والتسويق بالإيميل',
    template: '%s — أدوات البريد',
  },
  description:
    'مراجعات ومقارنات عملية تساعدك تختار أداة النشرات البريدية والتسويق بالإيميل المناسبة لصناع المحتوى العرب',
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
