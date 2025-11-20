'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart, ArrowLeft, Droplets } from 'lucide-react';
import Link from 'next/link';
import { bloodGroups, bangladeshCities, bangladeshAreas } from '@/lib/utils';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  area: z.string().min(2, 'Area is required'),
  city: z.string().min(2, 'City is required'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Registration successful! Please login with your credentials.');
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(error.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
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
            backgroundImage: "url('https://images.unsplash.com/photo-1576765607924-bf60b2f36b88?auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 to-blue-600/60"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white px-8 max-w-md">
              <div className="medical-gradient h-24 w-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h1 className="heading-1 mb-6 leading-tight">
                Join Our Lifesaving Community
              </h1>
              <p className="body-text font-light mb-6">
                Become a verified blood donor and help save lives
              </p>
              <p className="text-lg">
                Your donation can make a difference in someone's life
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="medical-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h2 className="heading-2 text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="body-text text-gray-600">
              Join our professional blood donor network
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center">
            <h2 className="heading-2 text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="body-text text-gray-600">
              Join our professional blood donor network
            </p>
          </div>

          <form
            onSubmit={registerForm.handleSubmit(handleRegister)}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...registerForm.register('name')}
                  type="text"
                  placeholder="Enter your full name"
                  className="input-field pl-10"
                />
              </div>
              {registerForm.formState.errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="Enter your email address"
                  className="input-field pl-10"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {registerForm.formState.errors.email.message}
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
                  {...registerForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
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
              {registerForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-2">
                  {registerForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...registerForm.register('phone')}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Blood Group
              </label>
              <div className="relative">
                <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...registerForm.register('bloodGroup')}
                  className="input-field pl-10"
                >
                  <option value="">Select your blood group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              {registerForm.formState.errors.bloodGroup && (
                <p className="text-red-500 text-sm mt-2">
                  {registerForm.formState.errors.bloodGroup.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...registerForm.register('city')}
                  className="input-field pl-10"
                >
                  <option value="">Select your city</option>
                  {bangladeshCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {registerForm.formState.errors.city && (
                <p className="text-red-500 text-sm mt-2">
                  {registerForm.formState.errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  {...registerForm.register('area')}
                  className="input-field pl-10"
                >
                  <option value="">Select your area</option>
                  {bangladeshAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              {registerForm.formState.errors.area && (
                <p className="text-red-500 text-sm mt-2">
                  {registerForm.formState.errors.area.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition"
              >
                Sign in here
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