import type { Metadata } from 'next';
import { Cormorant_Infant, Kaushan_Script } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'I love you babe <3',
  description: 'A little something for my little someone',
};

const cormorant = Cormorant_Infant({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const kapakana = Kaushan_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-kapakana',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${kapakana.variable}`}>
      <body>{children}</body>
    </html>
  );
}

