'use client';

import { useState, useEffect } from 'react';
import { Heart, User, Mail, Phone, MapPin, Calendar, LogOut, Settings, Bell, Shield, Users, Clock, CheckCircle, XCircle, Droplets } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface User {
  id: number;
  name: string;
  email: string;
  bloodGroup: string;
  area: string;
  city: string;
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      window.location.href = '/login';
      return;
    }

    setUser(JSON.parse(userData));
    loadContactRequests();
  }, []);

  const loadContactRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contact-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setContactRequests(data.requests);
      }
    } catch (error) {
      console.error('Error loading contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactRequestResponse = async (requestId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/contact-requests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getBloodGroupBadgeClass = (bloodGroup: string) => {
    const group = bloodGroup.toLowerCase().replace('+', '-positive').replace('-', '-negative');
    // Mapping to tailwind classes for badges
    const base = "px-3 py-1 rounded-full text-sm font-bold shadow-sm";
    if (group.includes('positive')) return `${base} bg-red-100 text-red-700 border border-red-200`;
    if (group.includes('negative')) return `${base} bg-red-50 text-red-600 border border-red-200`;
    return `${base} bg-gray-100 text-gray-700`;
  };

  const getStatusBadgeClass = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium border";
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

  if (!user) {
    return null;
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
              <span className="text-foreground font-medium hidden sm:inline-block">Welcome, {user.name}</span>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
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
              Professional Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your profile and contact requests
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-[#800000] text-black border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="bg-white/20 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner backdrop-blur-sm">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{user.name}</h2>
                    <span className={`${getBloodGroupBadgeClass(user.bloodGroup)} bg-white/90 text-black border-transparent`}>
                      {user.bloodGroup}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm text-white">
                      <Mail className="h-5 w-5 text-white/80" />
                      <div>
                        <p className="text-sm font-medium text-white/80">Email</p>
                        <p className="text-sm text-white font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm text-white">
                      <MapPin className="h-5 w-5 text-white/80" />
                      <div>
                        <p className="text-sm font-medium text-white/80">Location</p>
                        <p className="text-sm text-white font-medium">{user.area}, {user.city}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30 backdrop-blur-sm">
                      <Shield className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm font-medium text-green-300">Status</p>
                        <p className="text-sm text-green-100 font-medium">Verified Donor</p>
                      </div>
                    </div>
                  </div>

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
                        <CardDescription>Manage incoming contact requests</CardDescription>
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
                        You haven't received any contact requests yet. 
                        Your profile is visible to blood seekers.
                      </p>
                      <Link href="/find-donors">
                        <Button>Find Other Donors</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contactRequests.map((request) => (
                        <div key={request.id} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-card">
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

          {/* Statistics Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
              <CardContent className="pt-8">
                <div className="text-center mb-8">
                  <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your Impact</h3>
                  <p className="text-muted-foreground">
                    Track your contribution to the blood donation community
                  </p>
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
                      {contactRequests.filter(r => r.status === 'approved').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Approved Requests</div>
                  </div>
                  
                  <div className="text-center p-4 bg-background rounded-xl shadow-sm border border-border">
                    <div className="bg-amber-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {contactRequests.filter(r => r.status === 'pending').length}
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
        </div>
      </section>
    </div>
  );
}

 