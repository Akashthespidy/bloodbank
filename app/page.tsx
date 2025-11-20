'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Search, UserPlus, Mail, Phone, MapPin, Clock, Award, Shield, Users, ArrowRight, Globe, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 nav-glass rounded-b-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="blood-gradient h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Blood Bank BD</h1>
              <p className="text-xs text-gray-600">Professional Blood Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Hi, {user?.name}</span>
                <Link href="/dashboard" className="btn-outline">Dashboard</Link>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-outline">Login</Link>
                <Link href="/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-75"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600959907703-c845a60a69a1?auto=format&fit=crop&w=1950&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 to-blue-600/40" />
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
          <div className="blood-gradient h-20 w-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl animate-fade-in">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 animate-fade-in">
            Professional Blood Bank
          </h2>
          <p className="text-lg md:text-xl text-gray-100 mb-8 animate-fade-in delay-150">
            Connecting donors and recipients across Bangladesh securely and efficiently.
          </p>
          <div className="flex gap-4 animate-fade-in delay-300">
            <Link href="/find-donors" className="btn-primary inline-flex items-center">
              <Search className="mr-2" /> Find Donors
            </Link>
            <Link href="/register" className="btn-outline inline-flex items-center">
              <UserPlus className="mr-2" /> Become a Donor
            </Link>
          </div>
        </div>
      </section>

      {/* Add CSS classes in globals.css */}
      {/* See styles below... */}
    </div>
  );
}
