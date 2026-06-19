import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Footer } from '@/components/site/Footer';
import { Navigation } from '@/components/site/Navigation';
import { PageTransition } from '@/components/animations/PageTransition';
import { LenisProvider } from '@/providers/LenisProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'HNVNS | Healthcare Staffing Marketplace for Imaging',
  description: 'HNVNS connects hospitals and diagnostic teams with verified imaging and clinical talent through AI-powered staffing.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'HNVNS | Healthcare Staffing Marketplace',
    description: 'AI-assisted staffing for imaging departments, candidate matching, and credential-verified hires.',
    type: 'website',
    locale: 'en_US',
    siteName: 'HNVNS'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HNVNS | Healthcare Staffing Marketplace',
    description: 'AI-assisted staffing for imaging departments, candidate matching, and credential-verified hires.'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <LenisProvider>
          <Navigation />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
