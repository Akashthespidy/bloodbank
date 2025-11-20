import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Blood Bank Management System - Bangladesh",
  description: "Find blood donors in Bangladesh. Search by blood group, area, or city. Connect with donors safely and securely.",
  keywords: "blood bank, blood donation, Bangladesh, donors, emergency, healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} min-h-screen bg-background font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
