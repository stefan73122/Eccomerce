import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import { parseThemeFromRaw, THEME_COOKIE } from '@/lib/theme/themeUtils';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Storefront — Premium Products at Wholesale Prices',
  description: 'Your one-stop destination for premium products at wholesale prices. Quality, style, and value.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(THEME_COOKIE)?.value;
  const initialTheme = parseThemeFromRaw(raw);

  return (
    <html lang="en">
      <body className={`${inter.variable} font-primary antialiased`}>
        <ThemeProvider initialTheme={initialTheme}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
