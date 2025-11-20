import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
