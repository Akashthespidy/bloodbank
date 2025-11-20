'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, MapPin, Droplets, Calendar, Phone, Mail, Heart, ArrowLeft, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { bloodGroups, bangladeshCities, bangladeshAreas } from '@/lib/utils';

const searchSchema = z.object({
  bloodGroup: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

interface Donor {
  id: number;
  name: string;
  blood_group: string;
  area: string;
  city: string;
  created_at: string;
}

export default function FindDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const searchForm = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    searchDonors();
  }, []);

  const searchDonors = async (filters?: SearchForm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters?.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters?.area) params.append('area', filters.area);
      if (filters?.city) params.append('city', filters.city);

      const response = await fetch(`/api/donors?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors);
      }
    } catch (error) {
      console.error('Error searching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (data: SearchForm) => {
    searchDonors(data);
  };

  const getBloodGroupBadgeClass = (bloodGroup: string) => {
    const group = bloodGroup.toLowerCase().replace('+', '-positive').replace('-', '-negative');
    return `blood-badge-${group}`;
  };

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
              <Link href="/" className="btn-outline text-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="blood-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="h-10 w-10 text-white" />
            </div>
            <h1 className="heading-1 text-gray-900 mb-4">
              Find Blood Donors
            </h1>
            <p className="body-text text-gray-600 max-w-2xl mx-auto">
              Search our comprehensive database of verified blood donors across Bangladesh. 
              Use advanced filters to find donors by blood group, location, and availability.
            </p>
          </div>

          {/* Search Form */}
          <div className="card max-w-4xl mx-auto mb-12">
            <form onSubmit={searchForm.handleSubmit(handleSearch)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Blood Group
                  </label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      {...searchForm.register('bloodGroup')}
                      className="input-field pl-10"
                    >
                      <option value="">All Blood Groups</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      {...searchForm.register('city')}
                      className="input-field pl-10"
                    >
                      <option value="">All Cities</option>
                      {bangladeshCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Area
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      {...searchForm.register('area')}
                      className="input-field pl-10"
                    >
                      <option value="">All Areas</option>
                      {bangladeshAreas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary inline-flex items-center"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {loading ? 'Searching...' : 'Search Donors'}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="heading-2 text-gray-900">
                Available Donors ({donors.length})
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Verified Donors</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="blood-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="h-8 w-8 text-white animate-pulse" />
                </div>
                <p className="text-gray-600">Searching for donors...</p>
              </div>
            ) : donors.length === 0 ? (
              <div className="card text-center py-12">
                <div className="medical-gradient h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-2">No Donors Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or check back later for new donors.
                </p>
                <button
                  onClick={() => searchForm.reset()}
                  className="btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <div key={donor.id} className="card group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="blood-gradient h-12 w-12 rounded-xl flex items-center justify-center shadow-lg">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          <p className="text-sm text-gray-600">Verified Donor</p>
                        </div>
                      </div>
                      <span className={`blood-badge ${getBloodGroupBadgeClass(donor.blood_group)}`}>
                        {donor.blood_group}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{donor.area}, {donor.city}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Joined {new Date(donor.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {isAuthenticated ? (
                        <Link
                          href={`/contact-donor/${donor.id}`}
                          className="btn-primary text-sm"
                        >
                          Contact Donor
                        </Link>
                      ) : (
                        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm font-medium">Login to Contact</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Available</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-16">
            <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="text-center mb-6">
                <div className="bg-blue-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="heading-3 text-blue-900 mb-2">How to Contact Donors</h3>
                <p className="text-blue-800">
                  Follow our secure process to connect with blood donors
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Login Required</h4>
                  <p className="text-sm text-blue-800">
                    You must be logged in to contact donors for security
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Send Request</h4>
                  <p className="text-sm text-blue-800">
                    Send a contact request with your details and needs
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-100 h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-blue-900 mb-2">Get Connected</h4>
                  <p className="text-sm text-blue-800">
                    Donor will review and respond to your request
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