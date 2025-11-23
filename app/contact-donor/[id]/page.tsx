'use client';

import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Calendar,
  Droplets,
  LogIn,
  MapPin,
  MessageSquare,
  Send,
  Shield,
  Star,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useContactRequests, useRatings } from '@/lib/hooks';
import type { Donor } from '@/lib/store';

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

export default function ContactDonorPage() {
  const params = useParams();
  const router = useRouter();
  const donorId = params.id as string;
  const { isSignedIn, userId, getToken } = useAuth();
  const { user } = useUser();

  const [donor, setDonor] = useState<Donor | null>(null);
  const [_loading, _setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Use Jotai hooks
  const { ratings, averageRating, totalRatings, fetchRatings, submitRating } = useRatings(donorId);
  const { sendContactRequest } = useContactRequests();

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

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

  useEffect(() => {
    fetchDonorDetails();
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donorId]);

  const handleContactRequest = async (data: ContactForm) => {
    if (!isSignedIn) {
      alert('Please sign in to contact donors');
      return;
    }

    setSending(true);
    const result = await sendContactRequest(parseInt(donorId, 10), data, getToken);

    if (result.success) {
      alert('Contact request sent successfully! The donor will be notified via email.');
      router.push('/find-donors');
    } else {
      alert(result.error || 'Failed to send contact request');
    }
    setSending(false);
  };

  const handleSubmitRating = async () => {
    if (!isSignedIn) {
      alert('Please sign in to rate donors');
      return;
    }

    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmittingRating(true);
    const result = await submitRating(userRating, ratingComment, getToken);

    if (result.success) {
      alert('Rating submitted successfully!');
      setUserRating(0);
      setRatingComment('');
    } else {
      alert(result.error || 'Failed to submit rating');
    }
    setSubmittingRating(false);
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

        {/* Rating Section */}
        <Card className="bg-white border-none shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-black">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span>Donor Ratings</span>
              </div>
              {totalRatings > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-yellow-500">{averageRating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= averageRating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({totalRatings} reviews)</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating Form */}
            {isSignedIn && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-black">Rate this donor</h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= userRating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                  {userRating > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      {userRating} star{userRating > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <Textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share your experience (optional)..."
                  rows={3}
                  className="bg-white border-gray-300 text-black resize-none"
                />
                <Button
                  onClick={handleSubmitRating}
                  disabled={submittingRating || userRating === 0}
                  className="w-full"
                >
                  {submittingRating ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            )}

            {/* Ratings List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-black">Reviews</h3>
              {ratings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No ratings yet</p>
              ) : (
                ratings.map((rating) => (
                  <div key={rating.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-black">{rating.raterName}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= rating.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {rating.comment && (
                          <p className="text-sm text-gray-600">{rating.comment}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
