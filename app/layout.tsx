import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
  title: 'HNVNS | Full-stack Radiology, AI Diagnostics, and Reporting',
  description: 'HNVNS combines advanced imaging, AI-assisted diagnostics, and precision reporting for hospitals, clinics, and research teams.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'HNVNS | Full-stack Radiology, AI Diagnostics, and Reporting',
    description: 'Advanced imaging, AI diagnostics, and precision reporting for modern radiology teams.',
    type: 'website',
    locale: 'en_US',
    siteName: 'HNVNS'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HNVNS | Full-stack Radiology',
    description: 'Advanced imaging, AI diagnostics, and precision reporting for modern radiology teams.'
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
      </body>
    </html>
  );
}
