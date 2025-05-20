import { Lora, Geist_Mono as GeistMono } from 'next/font/google';

export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});
