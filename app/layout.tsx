import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Alexandria, IBM_Plex_Sans_Arabic, Inter, Urbanist } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { getLocaleDirection, isLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/site-content';
import { siteConfig } from '@/lib/site-config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
});

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  variable: '--font-alexandria',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-ibm-plex-sans-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'El Shihry Developments | Luxury Real Estate',
    template: '%s | El Shihry Developments',
  },
  description: 'Luxury real estate developments in Egypt by El Shihry Developments.',
  manifest: '/fav-icons/site.webmanifest',
  icons: {
    icon: [
      { url: '/fav-icons/favicon.ico' },
      { url: '/fav-icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/fav-icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/fav-icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/fav-icons/favicon.ico',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const headerLocale = headerList.get('x-site-locale');
  const locale: Locale = headerLocale && isLocale(headerLocale) ? headerLocale : 'ar';

  return (
    <html
      lang={locale}
      dir={getLocaleDirection(locale)}
      className={`${inter.variable} ${urbanist.variable} ${alexandria.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className={locale === 'ar' ? 'font-arabic' : 'font-sans'} suppressHydrationWarning>
        <GoogleAnalytics />
        <Script
          src="https://api.alshahri.com/crm-tracker.js?key=sk_lp_880ab6b6fca403ba7d370bd0067d5ac2fc3e2f478c8b9757"
          strategy="afterInteractive"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          .motion-safe {
             will-change: transform, opacity;
             transform: translateZ(0);
          }
        `}} />
        {children}
      </body>
    </html>
  );
}
