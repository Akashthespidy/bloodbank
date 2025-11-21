'use client';

import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Droplets,
  Edit,
  Heart,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth, useUser, SignOutButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DonorInfo {
  id: number;
  name: string;
  email: string;
  bloodGroup: string;
  area: string;
  city: string;
  phone: string;
  createdAt: string;
}

interface ContactRequest {
  id: number;
  status: string;
  message: string;
  createdAt: string;
  requester_name: string;
  requester_email: string;
  requester_phone: string;
  requester_blood_group: string;
  requester_area: string;
}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];

const areasByCity: Record<string, string[]> = {
  Dhaka: ['Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara', 'Mohammadpur', 'Motijheel'],
  Chittagong: ['Agrabad', 'Nasirabad', 'Panchlaish', 'Khulshi', 'Halishahar'],
  Sylhet: ['Zindabazar', 'Ambarkhana', 'Shahjalal Upashahar', 'Mira Bazar'],
  Rajshahi: ['Shaheb Bazar', 'Boalia', 'Motihar', 'Rajpara'],
  Khulna: ['Khalishpur', 'Sonadanga', 'Doulatpur', 'Khanjahan Ali'],
  Barishal: ['Nathullabad', 'Bogra Road', 'Sadar Road'],
  Rangpur: ['Jahaj Company', 'Dhap', 'Satmatha'],
  Mymensingh: ['Charpara', 'Ganginarpar', 'Kachari'],
};

export default function DashboardPage() {
  const { isSignedIn, userId } = useAuth();
  const { user: clerkUser } = useUser();
  const [donorInfo, setDonorInfo] = useState<DonorInfo | null>(null);
  const [isDonor, setIsDonor] = useState(false);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bloodGroup: '',
    area: '',
    city: '',
    phone: '',
  });

  useEffect(() => {
    if (isSignedIn) {
      loadDonorInfo();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const loadDonorInfo = async () => {
    try {
      const response = await fetch('/api/donor-profile');
      const data = await response.json();

      if (data.isDonor) {
        setIsDonor(true);
        setDonorInfo(data.donor);
        setEditForm({
          bloodGroup: data.donor.bloodGroup,
          area: data.donor.area,
          city: data.donor.city,
          phone: data.donor.phone || '',
        });
        loadContactRequests();
      }
    } catch (error) {
      console.error('Error loading donor info:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContactRequests = async () => {
    try {
      const response = await fetch('/api/contact-requests');
      if (response.ok) {
        const data = await response.json();
        setContactRequests(data.requests);
      }
    } catch (error) {
      console.error('Error loading contact requests:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/donor-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        loadDonorInfo();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleContactRequestResponse = async (requestId: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/contact-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status }),
      });

      if (response.ok) {
        alert(`Contact request ${status} successfully`);
        loadContactRequests();
      } else {
        alert('Failed to update contact request');
      }
    } catch (error) {
      alert('Failed to update contact request');
    }
  };

  const getBloodGroupBadgeClass = (bloodGroup: string) => {
    const base = 'px-3 py-1 rounded-full text-sm font-bold shadow-sm';
    return `${base} bg-red-100 text-red-700 border border-red-200`;
  };

  const getStatusBadgeClass = (status: string) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium border';
    switch (status) {
      case 'pending':
        return `${base} bg-amber-50 text-amber-700 border-amber-200`;
      case 'approved':
        return `${base} bg-green-50 text-green-700 border-green-200`;
      case 'rejected':
        return `${base} bg-red-50 text-red-700 border-red-200`;
      default:
        return `${base} bg-gray-50 text-gray-700 border-gray-200`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">BloodBank BD</span>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-foreground font-medium hidden sm:inline-block">
                {clerkUser?.firstName || clerkUser?.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              {isDonor ? 'Donor Dashboard' : 'User Dashboard'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isDonor
                ? 'Manage your donor profile and contact requests'
                : 'You are not registered as a donor yet'}
            </p>
          </div>

          {!isDonor ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Not a Donor Yet</CardTitle>
                <CardDescription>
                  Register as a blood donor to help save lives and receive contact requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Heart className="mr-2 h-4 w-4" />
                    Register as a Donor
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card className="bg-[#800000] text-white border-none shadow-lg">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="bg-white/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner backdrop-blur-sm">
                        <User className="h-12 w-12 text-white" />
                      </div>
                      <h2 className="text-2xl font-semibold text-white mb-2">{donorInfo?.name}</h2>
                      <span className={`${getBloodGroupBadgeClass(donorInfo?.bloodGroup || '')} bg-white/90 text-black border-transparent`}>
                        {donorInfo?.bloodGroup}
                      </span>
                    </div>

                    {!isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                          <Mail className="h-5 w-5 text-white/80" />
                          <div>
                            <p className="text-sm font-medium text-white/80">Email</p>
                            <p className="text-sm text-white font-medium">{donorInfo?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                          <MapPin className="h-5 w-5 text-white/80" />
                          <div>
                            <p className="text-sm font-medium text-white/80">Location</p>
                            <p className="text-sm text-white font-medium">
                              {donorInfo?.area}, {donorInfo?.city}
                            </p>
                          </div>
                        </div>

                        {donorInfo?.phone && (
                          <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Phone className="h-5 w-5 text-white/80" />
                            <div>
                              <p className="text-sm font-medium text-white/80">Phone</p>
                              <p className="text-sm text-white font-medium">{donorInfo.phone}</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30 backdrop-blur-sm">
                          <Shield className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-sm font-medium text-green-300">Status</p>
                            <p className="text-sm text-green-100 font-medium">Verified Donor</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => setIsEditing(true)}
                          className="w-full bg-white text-[#800000] hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white/80">Blood Group</Label>
                          <Select value={editForm.bloodGroup} onValueChange={(value) => setEditForm({ ...editForm, bloodGroup: value })}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                  {group}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-white/80">City</Label>
                          <Select
                            value={editForm.city}
                            onValueChange={(value) => {
                              setEditForm({ ...editForm, city: value, area: '' });
                            }}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-white/80">Area</Label>
                          <Select value={editForm.area} onValueChange={(value) => setEditForm({ ...editForm, area: value })}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(areasByCity[editForm.city] || []).map((area) => (
                                <SelectItem key={area} value={area}>
                                  {area}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-white/80">Phone</Label>
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            placeholder="Phone number"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button onClick={handleSaveEdit} className="flex-1 bg-white text-[#800000] hover:bg-gray-100">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            onClick={() => setIsEditing(false)}
                            variant="outline"
                            className="flex-1 border-white/20 text-white hover:bg-white/10"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 space-y-3">
                      <Link href="/find-donors">
                        <Button className="w-full bg-white text-[#800000] hover:bg-gray-100">
                          <Users className="h-4 w-4 mr-2" />
                          Find Donors
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Requests */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 h-10 w-10 rounded-lg flex items-center justify-center">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle>Contact Requests</CardTitle>
                          <CardDescription>Manage incoming blood requests</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{contactRequests.length}</div>
                        <div className="text-xs text-muted-foreground">Total Requests</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {contactRequests.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="bg-muted h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Bell className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">No Contact Requests</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't received any contact requests yet. Your profile is visible to blood seekers.
                        </p>
                        <Link href="/find-donors">
                          <Button>Find Other Donors</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {contactRequests.map((request) => (
                          <div
                            key={request.id}
                            className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">{request.requester_name}</h3>
                                  <p className="text-sm text-muted-foreground">{request.requester_email}</p>
                                </div>
                              </div>
                              <span className={getStatusBadgeClass(request.status)}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Droplets className="h-4 w-4" />
                                <span>Blood Group: {request.requester_blood_group}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Location: {request.requester_area}</span>
                              </div>
                              {request.requester_phone && (
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  <span>Phone: {request.requester_phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {request.message && (
                              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-foreground">{request.message}</p>
                              </div>
                            )}

                            {request.status === 'pending' && (
                              <div className="flex space-x-3">
                                <Button
                                  onClick={() => handleContactRequestResponse(request.id, 'approved')}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleContactRequestResponse(request.id, 'rejected')}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            )}

                            {request.status === 'approved' && (
                              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Contact information shared</span>
                              </div>
                            )}

                            {request.status === 'rejected' && (
                              <div className="flex items-center space-x-2 text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                                <XCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Request declined</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Statistics Section */}
          {isDonor && (
            <div className="mt-16">
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
                <CardContent className="pt-8">
                  <div className="text-center mb-8">
                    <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Your Impact</h3>
                    <p className="text-muted-foreground">Track your contribution to the blood donation community</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-background rounded-xl shadow-sm border border-border">
                      <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">{contactRequests.length}</div>
                      <div className="text-sm text-muted-foreground">Contact Requests</div>
                    </div>

                    <div className="text-center p-4 bg-background rounded-xl shadow-sm border border-border">
                      <div className="bg-green-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {contactRequests.filter((r) => r.status === 'approved').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Approved Requests</div>
                    </div>

                    <div className="text-center p-4 bg-background rounded-xl shadow-sm border border-border">
                      <div className="bg-amber-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {contactRequests.filter((r) => r.status === 'pending').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Pending Requests</div>
                    </div>

                    <div className="text-center p-4 bg-background rounded-xl shadow-sm border border-border">
                      <div className="bg-blue-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-foreground">Active</div>
                      <div className="text-sm text-muted-foreground">Account Status</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
