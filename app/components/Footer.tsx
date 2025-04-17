import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pixel Store - Digital Pixel Art Marketplace',
  description: 'Buy, sell and trade unique pixel art collectibles',
};

export default function RootLayout({
  children,
}: {
  children?: ReactNode; // Made children optional
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-black text-white`}>
        <Header />
        <main className="flex-grow">{children}</main> {/* Will render nothing if children is undefined */}
        <Footer />
      </body>
    </html>
  );
}
