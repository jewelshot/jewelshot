import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ErrorBoundary } from '@/components/organisms/ErrorBoundary';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
