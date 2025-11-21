'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Dashboard', href: '/dashboard' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    scrolled: {
      backdropFilter: 'blur(20px)',
      backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: 'auto' },
  };

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      variants={headerVariants}
      initial="initial"
      animate={isScrolled ? 'scrolled' : 'animate'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        backgroundColor: isScrolled
          ? theme === 'dark'
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.8)'
          : 'transparent',
        boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Link prefetch={false} href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Heart className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-xl font-bold text-transparent">
                BloodBank BD
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                prefetch={false}
                href={item.href}
                className="text-foreground flex items-center space-x-1 font-medium transition-colors duration-200 hover:text-primary"
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center space-x-4 lg:flex">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-10 w-10',
                      userButtonPopoverCard: 'shadow-xl',
                      userButtonPopoverActionButton: 'hover:bg-muted',
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            className="hover:bg-muted rounded-lg p-2 transition-colors duration-200 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="overflow-hidden lg:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="border-border bg-background/95 mt-4 space-y-2 rounded-xl border py-4 shadow-xl backdrop-blur-lg">
                {navItems.map((item) => (
                  <Link
                    prefetch={false}
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:bg-muted block px-4 py-3 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="space-y-2 px-4 py-2">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="bg-blue-600 text-white w-full rounded-lg py-2.5 text-center font-medium hover:bg-blue-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="text-sm text-muted-foreground px-2 py-1">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                    </div>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: 'h-10 w-10',
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
