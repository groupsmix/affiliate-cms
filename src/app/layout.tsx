import type { Metadata } from 'next';
import './globals.css';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'أدوات البريد — أفضل أدوات النشرات البريدية والتسويق بالإيميل',
  description: 'مراجعات ومقارنات عملية تساعدك تختار أداة النشرات البريدية والتسويق بالإيميل المناسبة لصناع المحتوى العرب',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
