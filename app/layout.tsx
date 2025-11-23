import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Blood Bank Management System - Bangladesh',
  description:
    'Find blood donors in Bangladesh. Search by blood group, area, or city. Connect with donors safely and securely.',
  keywords: 'blood bank, blood donation, Bangladesh, donors, emergency, healthcare',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${outfit.variable} min-h-screen bg-background font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
