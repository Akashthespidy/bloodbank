'use client';

import { useState, useEffect } from 'react';
import { Heart, User, Mail, Phone, MapPin, Calendar, LogOut, Settings, Bell, Shield, Users, Clock, CheckCircle, XCircle, Clock as ClockIcon, Droplets } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  blood_group: string;
  area: string;
  city: string;
}

interface ContactRequest {
  id: number;
  status: string;
  message: string;
  created_at: string;
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
    return `blood-badge-${group}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="blood-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
              <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 text-gray-900 mb-4">
              Professional Dashboard
            </h1>
            <p className="body-text text-gray-600">
              Manage your profile and contact requests
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center mb-6">
                  <div className="blood-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="heading-2 text-gray-900 mb-2">{user.name}</h2>
                  <span className={`blood-badge ${getBloodGroupBadgeClass(user.blood_group)}`}>
                    {user.blood_group}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">{user.area}, {user.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Status</p>
                      <p className="text-sm text-green-700">Verified Donor</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link href="/find-donors" className="btn-primary w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Find Donors
                  </Link>
                  <Link href="/" className="btn-outline w-full">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Requests */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="medical-gradient h-12 w-12 rounded-xl flex items-center justify-center shadow-lg">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="heading-2 text-gray-900">Contact Requests</h2>
                      <p className="text-gray-600">Manage incoming contact requests</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{contactRequests.length}</div>
                    <div className="text-sm text-gray-600">Total Requests</div>
                  </div>
                </div>

                {contactRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="medical-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Bell className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="heading-3 text-gray-900 mb-2">No Contact Requests</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't received any contact requests yet. 
                      Your profile is visible to blood seekers.
                    </p>
                    <Link href="/find-donors" className="btn-primary">
                      Find Other Donors
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="blood-gradient h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{request.requester_name}</h3>
                              <p className="text-sm text-gray-600">{request.requester_email}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Droplets className="h-4 w-4" />
                            <span>Blood Group: {request.requester_blood_group}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>Location: {request.requester_area}</span>
                          </div>
                          {request.requester_phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>Phone: {request.requester_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {request.message && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{request.message}</p>
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleContactRequestResponse(request.id, 'approved')}
                              className="btn-primary text-sm inline-flex items-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleContactRequestResponse(request.id, 'rejected')}
                              className="btn-secondary text-sm inline-flex items-center"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </button>
                          </div>
                        )}

                        {request.status === 'approved' && (
                          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Contact information shared</span>
                          </div>
                        )}

                        {request.status === 'rejected' && (
                          <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Request declined</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="mt-16">
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="text-center mb-8">
                <div className="bg-purple-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="heading-3 text-purple-900 mb-2">Your Impact</h3>
                <p className="text-purple-800">
                  Track your contribution to the blood donation community
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="blood-gradient h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{contactRequests.length}</div>
                  <div className="text-sm text-gray-600">Contact Requests</div>
                </div>
                
                <div className="text-center">
                  <div className="medical-gradient h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {contactRequests.filter(r => r.status === 'approved').length}
                  </div>
                  <div className="text-sm text-gray-600">Approved Requests</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {contactRequests.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Requests</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">Active</div>
                  <div className="text-sm text-gray-600">Account Status</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 