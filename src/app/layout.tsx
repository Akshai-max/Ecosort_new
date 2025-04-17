import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoSort',
  description: 'EcoSort - Real time waste sorting system',
  icons: '/ecosort-logo.png',
  manifest: '/site.webmanifest', // This specifies the path to the web app manifest file which provides metadata for PWA functionality
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 