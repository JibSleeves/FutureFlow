import type { Metadata } from 'next';
import { lora, geistMono } from '@/lib/fonts';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { JournalProvider } from '@/contexts/journal-context';

export const metadata: Metadata = {
  title: 'FutureFlow',
  description: 'AI-powered divination and future insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${lora.variable} ${geistMono.variable} font-sans antialiased`}>
        <JournalProvider>
          {children}
        </JournalProvider>
        <Toaster />
      </body>
    </html>
  );
}
