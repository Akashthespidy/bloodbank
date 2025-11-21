'use client';

import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Calendar,
  Droplets,
  Heart,
  LogIn,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactSchema = z.object({
  hospital: z.string().min(3, 'Hospital name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contact: z.string().min(10, 'Contact number must be at least 10 characters'),
  time: z.string().min(1, 'Please specify the time'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be less than 500 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  area: string;
  city: string;
  createdAt: string;
}

export default function ContactDonorPage() {
  const params = useParams();
  const router = useRouter();
  const donorId = params.id as string;
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
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
        router.push('/find-donors');
      }
    } catch (error) {
      console.error('Error fetching donor details:', error);
      alert('Error loading donor details');
    }
  };

  const handleContactRequest = async (data: ContactForm) => {
    if (!isSignedIn) {
      alert('Please sign in to contact donors');
      return;
    }

    setSending(true);
    try {
      const token = await getToken();
      const response = await fetch('/api/contact-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donorId: parseInt(donorId),
          hospital: data.hospital,
          address: data.address,
          contact: data.contact,
          time: data.time,
          message: data.message,
        }),
      });

      if (response.ok) {
        alert('Contact request sent successfully! The donor will be notified via email.');
        router.push('/find-donors');
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
    const base = 'px-3 py-1 rounded-full text-sm font-bold shadow-sm';
    if (group.includes('positive')) return `${base} bg-red-100 text-red-700 border border-red-200`;
    if (group.includes('negative')) return `${base} bg-red-50 text-red-600 border border-red-200`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  if (!donor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading donor information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/find-donors"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Donors
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Donor Information Card */}
          <Card className="bg-white border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-black">{donor.name}</CardTitle>
                    <CardDescription className="text-black/70">Blood Donor</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <Droplets className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-black">Blood Group</span>
                </div>
                <span className={getBloodGroupBadgeClass(donor.bloodGroup)}>
                  {donor.bloodGroup}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-black">Location</span>
                </div>
                <span className="text-sm text-black font-semibold">
                  {donor.area}, {donor.city}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-black">Member Since</span>
                </div>
                <span className="text-sm text-black font-semibold">
                  {new Date(donor.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-black">Status</span>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  Available
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Card */}
          <Card className="bg-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-black">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Send Blood Request</span>
              </CardTitle>
              <CardDescription className="text-black/70">
                Fill in the details below to request blood from this donor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSignedIn ? (
                <div className="text-center py-8 space-y-4">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                    <LogIn className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-black">Sign In Required</h3>
                  <p className="text-sm text-black/70 max-w-sm mx-auto">
                    You need to sign in to send blood requests to donors. This helps us maintain
                    security and accountability.
                  </p>
                  <SignInButton mode="modal">
                    <Button className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In to Request Blood
                    </Button>
                  </SignInButton>
                </div>
              ) : (
                <form
                  onSubmit={contactForm.handleSubmit(handleContactRequest)}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Hospital Name *
                      </label>
                      <Input
                        {...contactForm.register('hospital')}
                        placeholder="Enter hospital name"
                        className="bg-white border-gray-300 text-black"
                      />
                      {contactForm.formState.errors.hospital && (
                        <p className="text-red-500 text-xs mt-1">
                          {contactForm.formState.errors.hospital.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Contact Number *
                      </label>
                      <Input
                        {...contactForm.register('contact')}
                        placeholder="Your contact number"
                        className="bg-white border-gray-300 text-black"
                      />
                      {contactForm.formState.errors.contact && (
                        <p className="text-red-500 text-xs mt-1">
                          {contactForm.formState.errors.contact.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Hospital Address *
                    </label>
                    <Input
                      {...contactForm.register('address')}
                      placeholder="Full hospital address"
                      className="bg-white border-gray-300 text-black"
                    />
                    {contactForm.formState.errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {contactForm.formState.errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Required Time *
                    </label>
                    <Input
                      {...contactForm.register('time')}
                      type="datetime-local"
                      className="bg-white border-gray-300 text-black"
                    />
                    {contactForm.formState.errors.time && (
                      <p className="text-red-500 text-xs mt-1">
                        {contactForm.formState.errors.time.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Additional Message *
                    </label>
                    <Textarea
                      {...contactForm.register('message')}
                      placeholder="Provide any additional details about your request..."
                      rows={4}
                      className="bg-white border-gray-300 text-black resize-none"
                    />
                    {contactForm.formState.errors.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {contactForm.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Blood Request
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-black/60">
                    The donor will receive your request via email with all the details you provided.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
