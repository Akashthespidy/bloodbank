'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, MapPin, Droplets, Calendar, Phone, Mail, Heart, ArrowLeft, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { bloodGroups, bangladeshCities, bangladeshAreas } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    const base = "px-3 py-1 rounded-full text-sm font-bold shadow-sm";
    if (group.includes('positive')) return `${base} bg-red-100 text-red-700 border border-red-200`;
    if (group.includes('negative')) return `${base} bg-red-50 text-red-600 border border-red-200`;
    return `${base} bg-gray-100 text-gray-700`;
  };

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
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-primary/10 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Find Blood Donors
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search our comprehensive database of verified blood donors across Bangladesh. 
              Use advanced filters to find donors by blood group, location, and availability.
            </p>
          </div>

          {/* Search Form */}
          <Card className="max-w-4xl mx-auto mb-12">
            <CardContent className="pt-6">
              <form onSubmit={searchForm.handleSubmit(handleSearch)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Blood Group
                    </label>
                    <div className="relative">
                      <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        {...searchForm.register('bloodGroup')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        {...searchForm.register('city')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Area
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <select
                        {...searchForm.register('area')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Button type="submit" disabled={loading} size="lg">
                    <Search className="mr-2 h-5 w-5" />
                    {loading ? 'Searching...' : 'Search Donors'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                Available Donors ({donors.length})
              </h2>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Verified Donors</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground">Searching for donors...</p>
              </div>
            ) : donors.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="bg-muted h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Donors Found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or check back later for new donors.
                  </p>
                  <Button
                    onClick={() => searchForm.reset()}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <Card key={donor.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center shadow-inner">
                            <Heart className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{donor.name}</h3>
                            <p className="text-sm text-muted-foreground">Verified Donor</p>
                          </div>
                        </div>
                        <span className={getBloodGroupBadgeClass(donor.blood_group)}>
                          {donor.blood_group}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground/70" />
                          <span>{donor.area}, {donor.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground/70" />
                          <span>Joined {new Date(donor.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {isAuthenticated ? (
                          <Link href={`/contact-donor/${donor.id}`}>
                            <Button size="sm">Contact Donor</Button>
                          </Link>
                        ) : (
                          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm font-medium">Login to Contact</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-100">
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">How to Contact Donors</h3>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

 