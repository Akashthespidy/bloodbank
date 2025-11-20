'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        alert(error.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-700/80 to-red-600/60"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-8 max-w-md">
              <div className="blood-gradient h-24 w-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h1 className="heading-1 mb-6 leading-tight">
                Welcome to Blood Bank BD
              </h1>
              <p className="body-text font-light mb-6">
                Professional blood management system for Bangladesh
              </p>
              <p className="text-lg">
                Access our secure platform to connect with verified blood donors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="blood-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="heading-2 text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="body-text text-gray-600">
              Sign in to your professional account
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center">
            <h2 className="heading-2 text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="body-text text-gray-600">
              Sign in to your professional account
            </p>
          </div>

          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="Enter your email address"
                  className="input-field pl-10"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...loginForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-red-600 hover:text-red-700 font-semibold transition"
              >
                Register here
              </Link>
            </p>

            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
