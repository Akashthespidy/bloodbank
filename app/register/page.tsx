'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Heart, ArrowLeft, Droplets } from 'lucide-react';
import Link from 'next/link';
import { bloodGroups, bangladeshCities, bangladeshAreas } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

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
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1576765607924-bf60b2f36b88?auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-blue-600/70" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-12 text-center">
          <div className="bg-white/20 p-4 rounded-2xl mb-8 backdrop-blur-sm">
            <Heart className="h-12 w-12 text-white fill-white" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">Join Our Community</h1>
          <p className="text-lg text-white/90 max-w-md">
            Become a part of the largest blood donor network in Bangladesh and help save lives.
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input id="name" placeholder="John Doe" className="pl-10" {...registerForm.register('name')} />
                </div>
                {registerForm.formState.errors.name && <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="m@example.com" className="pl-10" {...registerForm.register('email')} />
                </div>
                {registerForm.formState.errors.email && <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type={showPassword ? 'text' : 'password'} className="pl-10 pr-10" {...registerForm.register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="phone">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="+880..." className="pl-10" {...registerForm.register('phone')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="bloodGroup">Blood Group</label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <select
                      id="bloodGroup"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                      {...registerForm.register('bloodGroup')}
                    >
                      <option value="">Select</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  {registerForm.formState.errors.bloodGroup && <p className="text-sm text-destructive">{registerForm.formState.errors.bloodGroup.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none" htmlFor="city">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <select
                      id="city"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                      {...registerForm.register('city')}
                    >
                      <option value="">Select</option>
                      {bangladeshCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  {registerForm.formState.errors.city && <p className="text-sm text-destructive">{registerForm.formState.errors.city.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="area">Area</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <select
                    id="area"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    {...registerForm.register('area')}
                  >
                    <option value="">Select Area</option>
                    {bangladeshAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                {registerForm.formState.errors.area && <p className="text-sm text-destructive">{registerForm.formState.errors.area.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 