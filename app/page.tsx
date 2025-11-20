'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, UserPlus, ArrowRight, Activity, Users, Calendar, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
  email: string;
  blood_group: string;
  area: string;
  city: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-primary fill-primary" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">BloodBank BD</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium hidden md:inline-block">Hi, {user?.name}</span>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-red-50/50 to-background dark:from-red-950/20 dark:to-background">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              Save a Life Today
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              Your Donation Can Make A <span className="text-primary">Difference</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with blood donors across Bangladesh. A secure, fast, and reliable platform for emergency blood management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/find-donors">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  <Search className="mr-2 h-5 w-5" /> Find Donors
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                  <UserPlus className="mr-2 h-5 w-5" /> Become a Donor
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">Why Choose BloodBank BD?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide the most reliable and fastest way to connect blood donors with those in need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background border-none shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">Real-time Availability</h3>
                <p className="text-muted-foreground">
                  Find donors who are available right now in your specific area.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">Verified Donors</h3>
                <p className="text-muted-foreground">
                  All our donors are verified to ensure safety and reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl">Community Driven</h3>
                <p className="text-muted-foreground">
                  Join a growing community of heroes saving lives every day.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">1000+</h4>
              <p className="text-muted-foreground">Active Donors</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">50+</h4>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">24/7</h4>
              <p className="text-muted-foreground">Support Available</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">500+</h4>
              <p className="text-muted-foreground">Lives Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Save a Life?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Join our community of donors today and be a hero in someone's story.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-bold">
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
