import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/organisms/ErrorBoundary';
import ToastContainer from '@/components/organisms/ToastContainer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Jewelshot Studio | AI-Powered Jewelry Photo Editor',
  description:
    'Professional jewelry photo editing with AI. Create stunning product images with advanced filters, background removal, and AI-powered enhancements.',
  keywords: [
    'jewelry photo editor',
    'AI image editing',
    'product photography',
    'e-commerce tools',
    'jewelry photography',
  ],
  authors: [{ name: 'Jewelshot' }],
  creator: 'Jewelshot',
  publisher: 'Jewelshot',
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
    locale: 'en_US',
    url: 'https://jewelshot.com',
    title: 'Jewelshot Studio | AI-Powered Jewelry Photo Editor',
    description:
      'Professional jewelry photo editing with AI. Create stunning product images instantly.',
    siteName: 'Jewelshot Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelshot Studio | AI-Powered Jewelry Photo Editor',
    description:
      'Professional jewelry photo editing with AI. Create stunning product images instantly.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
        data-theme="purple"
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        <ToastContainer />
      </body>
    </html>
  );
}
