import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${outfit.variable} min-h-screen bg-background font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Logo */}
                  <div className="flex items-center">
                    <a href="/" className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                        <svg className="h-6 w-6 text-white fill-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
                        BloodBank BD
                      </span>
                    </a>
                  </div>

                  {/* Auth Buttons - Only Clerk for Blood Requesters */}
                  <div className="flex items-center gap-4">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="text-foreground hover:text-primary font-medium text-sm sm:text-base px-4 cursor-pointer transition-colors">
                          Sign In to Request Blood
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="bg-primary text-primary-foreground rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                          Sign Up to Request
                        </button>
                      </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "h-10 w-10",
                            userButtonPopoverCard: "shadow-xl",
                            userButtonPopoverActionButton: "hover:bg-muted"
                          }
                        }}
                        userProfileMode="modal"
                        userProfileProps={{
                          appearance: {
                            elements: {
                              rootBox: "w-full",
                              card: "shadow-xl"
                            }
                          }
                        }}
                      />
                    </SignedIn>
                  </div>
                </div>
              </div>
            </header>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
