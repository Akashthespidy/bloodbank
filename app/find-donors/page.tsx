'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, MapPin, Droplets, Calendar, Phone, Mail, Heart, ArrowLeft, Users, Shield, Send } from 'lucide-react';
import Link from 'next/link';
import { bloodGroups, bangladeshCities, getAreasForCity } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const searchSchema = z.object({
  bloodGroup: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  area: string;
  city: string;
  createdAt: string;
}

export default function FindDonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [showBulkMessage, setShowBulkMessage] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');
  const [sendingBulk, setSendingBulk] = useState(false);

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      bloodGroup: 'all',
      area: 'all',
      city: 'all',
    },
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
      if (filters?.bloodGroup && filters.bloodGroup !== 'all') params.append('bloodGroup', filters.bloodGroup);
      if (filters?.area && filters.area !== 'all') params.append('area', filters.area);
      if (filters?.city && filters.city !== 'all') params.append('city', filters.city);

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

  const getBloodGroupVariant = (bloodGroup: string): "default" | "secondary" | "destructive" | "outline" => {
    if (bloodGroup.includes('+')) return 'destructive';
    return 'secondary';
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (city === 'all') {
      setAvailableAreas([]);
    } else {
      setAvailableAreas(getAreasForCity(city));
    }
    // Reset area selection when city changes
    form.setValue('area', 'all');
  };

  const handleBulkMessage = async () => {
    if (!bulkMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    if (donors.length === 0) {
      alert('No donors found to send message to');
      return;
    }

    setSendingBulk(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bulk-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donorIds: donors.map(d => d.id),
          message: bulkMessage,
          bloodGroup: form.getValues('bloodGroup'),
        }),
      });

      if (response.ok) {
        alert(`Message sent successfully to ${donors.length} donor(s)!`);
        setBulkMessage('');
        setShowBulkMessage(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send bulk message');
      }
    } catch (error) {
      alert('Failed to send bulk message');
    } finally {
      setSendingBulk(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/find-donor.png')" }}
        />
        <div className="absolute inset-0 bg-background/90 backdrop-blur-[2px]" />
      </div>
      
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

      {/* Main Content */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
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
          <Card className="max-w-4xl mx-auto mb-12 bg-white border-gray-200">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="bloodGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-semibold">Blood Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300 text-black">
                                <SelectValue placeholder="All Blood Groups" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Blood Groups</SelectItem>
                              {bloodGroups.map((group) => (
                                <SelectItem key={group} value={group}>
                                  <div className="flex items-center gap-2">
                                    <Droplets className="h-4 w-4 text-red-600" />
                                    {group}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-semibold">City</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            handleCityChange(value);
                          }} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300 text-black">
                                <SelectValue placeholder="All Cities" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Cities</SelectItem>
                              {bangladeshCities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    {city}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black font-semibold">Area</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300 text-black">
                                <SelectValue placeholder="All Areas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Areas</SelectItem>
                              {(selectedCity === 'all' ? [] : availableAreas).map((area: string) => (
                                <SelectItem key={area} value={area}>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    {area}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit" disabled={loading} size="lg">
                      <Search className="mr-2 h-5 w-5" />
                      {loading ? 'Searching...' : 'Search Donors'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Available Donors ({donors.length})
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Verified Donors</span>
                </div>
                {isAuthenticated && donors.length > 0 && (
                  <Button 
                    onClick={() => setShowBulkMessage(!showBulkMessage)}
                    variant="outline"
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Message All ({donors.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Bulk Message Card */}
            {showBulkMessage && isAuthenticated && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-1">
                          Send Bulk Message
                        </h3>
                        <p className="text-sm text-blue-700">
                          Send a message to all {donors.length} donor(s) matching your search criteria
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBulkMessage(false)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={bulkMessage}
                      onChange={(e) => setBulkMessage(e.target.value)}
                      rows={4}
                      placeholder="Enter your message to all donors..."
                      className="flex min-h-[80px] w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-black ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={() => setShowBulkMessage(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBulkMessage}
                        disabled={sendingBulk || !bulkMessage.trim()}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sendingBulk ? 'Sending...' : `Send to ${donors.length} Donor(s)`}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    onClick={() => form.reset()}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((donor) => (
                  <Card key={donor.id} className="group hover:shadow-lg transition-all duration-300 bg-white border-gray-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-red-50 h-12 w-12 rounded-xl flex items-center justify-center shadow-inner">
                            <Heart className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-black">{donor.name}</h3>
                            <p className="text-sm text-gray-600">Verified Donor</p>
                          </div>
                        </div>
                        <Badge variant={getBloodGroupVariant(donor.bloodGroup)} className="font-bold text-base px-3 py-1">
                          {donor.bloodGroup}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-black">
                          <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                          <span>{donor.area}, {donor.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-black">
                          <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                          <span>Joined {new Date(donor.createdAt).toLocaleDateString()}</span>
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