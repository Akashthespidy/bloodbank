'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageSquare, Heart, ArrowLeft, User, MapPin, Droplets, Calendar, Shield, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const contactSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

interface Donor {
  id: number;
  name: string;
  blood_group: string;
  area: string;
  city: string;
  created_at: string;
}

export default function ContactDonorPage() {
  const params = useParams();
  const donorId = params.id as string;
  
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    fetchDonorDetails();
  }, [donorId]);

  const fetchDonorDetails = async () => {
    try {
      const response = await fetch(`/api/donors/${donorId}`);
      if (response.ok) {
        const data = await response.json();
        setDonor(data.donor);
      } else {
        alert('Donor not found');
        window.location.href = '/find-donors';
      }
    } catch (error) {
      console.error('Error fetching donor details:', error);
      alert('Error loading donor details');
    }
  };

  const handleContactRequest = async (data: ContactForm) => {
    if (!isAuthenticated) {
      alert('Please login to contact donors');
      window.location.href = '/login';
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contact-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donorId: parseInt(donorId),
          message: data.message,
        }),
      });

      if (response.ok) {
        alert('Contact request sent successfully! The donor will be notified via email.');
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send contact request');
      }
    } catch (error) {
      alert('Failed to send contact request');
    } finally {
      setSending(false);
    }
  };

  const getBloodGroupBadgeClass = (bloodGroup: string) => {
    const group = bloodGroup.toLowerCase().replace('+', '-positive').replace('-', '-negative');
    const base = "px-3 py-1 rounded-full text-sm font-bold shadow-sm";
    if (group.includes('positive')) return `${base} bg-red-100 text-red-700 border border-red-200`;
    if (group.includes('negative')) return `${base} bg-red-50 text-red-600 border border-red-200`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  if (!donor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading donor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">Blood Bank BD</span>
                <p className="text-xs text-muted-foreground">Professional Blood Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/find-donors">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-primary/10 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Contact Blood Donor
            </h1>
            <p className="text-lg text-muted-foreground">
              Send a secure contact request to connect with this donor
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donor Information Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">{donor.name}</h2>
                  <span className={getBloodGroupBadgeClass(donor.blood_group)}>
                    {donor.blood_group}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">{donor.area}, {donor.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donor.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg border border-green-100">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">Status</p>
                      <p className="text-sm text-green-700">Available for Donation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Verified Donor</h4>
                      <p className="text-sm text-blue-800">
                        This donor has been verified and is part of our trusted network.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Send Contact Request</h3>
                  <p className="text-muted-foreground">
                    {isAuthenticated 
                      ? 'Send a message to request contact with this donor'
                      : 'Please login to send a contact request'
                    }
                  </p>
                </div>

                {isAuthenticated ? (
                  <form onSubmit={contactForm.handleSubmit(handleContactRequest)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Your Message
                      </label>
                      <textarea
                        {...contactForm.register('message')}
                        rows={6}
                        placeholder="Please provide details about your blood requirement, urgency, and any specific information that would help the donor understand your situation..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                      {contactForm.formState.errors.message && (
                        <p className="text-destructive text-sm mt-2">
                          {contactForm.formState.errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-900 mb-1">Important Note</h4>
                          <p className="text-sm text-amber-800">
                            Your contact request will be sent to the donor via email. 
                            They will review your request and respond accordingly.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full"
                      size="lg"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {sending ? 'Sending Request...' : 'Send Contact Request'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="bg-red-50/50 border border-red-100 rounded-lg p-6">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <Shield className="h-8 w-8 text-red-600" />
                        <h4 className="text-lg font-semibold text-red-900">Authentication Required</h4>
                      </div>
                      <p className="text-red-800 mb-6">
                        You must be logged in to contact donors. This ensures security 
                        and allows donors to review your profile before responding.
                      </p>
                      <div className="space-y-3">
                        <Link href="/login">
                          <Button className="w-full">Login to Continue</Button>
                        </Link>
                        <Link href="/register">
                          <Button variant="outline" className="w-full">Create Account</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 border-green-100">
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <div className="bg-green-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">How Contact Requests Work</h3>
                  <p className="text-green-800">
                    Our secure system ensures safe and professional communication
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="bg-green-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-green-900 mb-2">Send Request</h4>
                    <p className="text-sm text-green-800">
                      Your message is sent securely to the donor via email
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-green-900 mb-2">Donor Review</h4>
                    <p className="text-sm text-green-800">
                      Donor reviews your request and profile information
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-green-900 mb-2">Get Response</h4>
                    <p className="text-sm text-green-800">
                      Donor responds with contact details or additional information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}