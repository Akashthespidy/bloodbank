'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageSquare, Heart, ArrowLeft, User, MapPin, Droplets, Calendar, Shield, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
    return `blood-badge-${group}`;
  };

  if (!donor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="blood-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading donor details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="blood-gradient h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Blood Bank BD</span>
                <p className="text-xs text-gray-600">Professional Blood Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/find-donors" className="btn-outline text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="blood-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="h-10 w-10 text-white" />
            </div>
            <h1 className="heading-1 text-gray-900 mb-4">
              Contact Blood Donor
            </h1>
            <p className="body-text text-gray-600">
              Send a secure contact request to connect with this donor
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donor Information Card */}
            <div className="card">
              <div className="text-center mb-6">
                <div className="blood-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h2 className="heading-2 text-gray-900 mb-2">{donor.name}</h2>
                <span className={`blood-badge ${getBloodGroupBadgeClass(donor.blood_group)}`}>
                  {donor.blood_group}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{donor.area}, {donor.city}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-600">
                      {new Date(donor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Status</p>
                    <p className="text-sm text-green-700">Available for Donation</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
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
            </div>

            {/* Contact Form */}
            <div className="card">
              <div className="text-center mb-6">
                <div className="medical-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-2">Send Contact Request</h3>
                <p className="text-gray-600">
                  {isAuthenticated 
                    ? 'Send a message to request contact with this donor'
                    : 'Please login to send a contact request'
                  }
                </p>
              </div>

              {isAuthenticated ? (
                <form onSubmit={contactForm.handleSubmit(handleContactRequest)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Message
                    </label>
                    <textarea
                      {...contactForm.register('message')}
                      rows={6}
                      placeholder="Please provide details about your blood requirement, urgency, and any specific information that would help the donor understand your situation..."
                      className="input-field resize-none"
                    />
                    {contactForm.formState.errors.message && (
                      <p className="text-red-500 text-sm mt-2">
                        {contactForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
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

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full py-4 text-lg font-semibold inline-flex items-center justify-center"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {sending ? 'Sending Request...' : 'Send Contact Request'}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <Shield className="h-8 w-8 text-red-600" />
                      <h4 className="text-lg font-semibold text-red-900">Authentication Required</h4>
                    </div>
                    <p className="text-red-800 mb-6">
                      You must be logged in to contact donors. This ensures security 
                      and allows donors to review your profile before responding.
                    </p>
                    <div className="space-y-3">
                      <Link href="/login" className="btn-primary w-full">
                        Login to Continue
                      </Link>
                      <Link href="/register" className="btn-outline w-full">
                        Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-16">
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="text-center mb-6">
                <div className="bg-green-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="heading-3 text-green-900 mb-2">How Contact Requests Work</h3>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 