import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { z } from 'zod';
import {
  averageRatingAtom,
  contactRequestSchema,
  contactRequestsAtom,
  contactRequestsLoadingAtom,
  donorSchema,
  donorsAtom,
  donorsLoadingAtom,
  ratingSchema,
  ratingsAtom,
  type SearchFilters,
  searchFiltersAtom,
  totalRatingsAtom,
} from '@/lib/store';

// ============================================
// Donor Hooks
// ============================================

export function useDonors() {
  const [donors, setDonors] = useAtom(donorsAtom);
  const [loading, setLoading] = useAtom(donorsLoadingAtom);
  const [filters] = useAtom(searchFiltersAtom);

  const fetchDonors = useCallback(
    async (customFilters?: SearchFilters) => {
      setLoading(true);
      try {
        const activeFilters = customFilters || filters;
        const params = new URLSearchParams();

        if (activeFilters.bloodGroup && activeFilters.bloodGroup !== 'all') {
          params.append('bloodGroup', activeFilters.bloodGroup);
        }
        if (activeFilters.area && activeFilters.area !== 'all') {
          params.append('area', activeFilters.area);
        }
        if (activeFilters.city && activeFilters.city !== 'all') {
          params.append('city', activeFilters.city);
        }

        const response = await fetch(`/api/donors?${params}`);
        if (response.ok) {
          const data = await response.json();
          // Validate data with Zod
          const validatedDonors = z.array(donorSchema).parse(data.donors);
          setDonors(validatedDonors);
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
        setDonors([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, setDonors, setLoading]
  );

  return { donors, loading, fetchDonors };
}

export function useDonor(donorId: string) {
  const [_donor, _setDonor] = useAtom(donorsAtom);
  const [loading, setLoading] = useAtom(donorsLoadingAtom);

  const fetchDonor = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/donors/${donorId}`);
      if (response.ok) {
        const data = await response.json();
        // Validate with Zod
        const validatedDonor = donorSchema.parse(data.donor);
        return validatedDonor;
      }
      return null;
    } catch (error) {
      console.error('Error fetching donor:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [donorId, setLoading]);

  return { fetchDonor, loading };
}

// ============================================
// Rating Hooks
// ============================================

export function useRatings(donorId: string) {
  const [ratings, setRatings] = useAtom(ratingsAtom);
  const setAverageRating = useSetAtom(averageRatingAtom);
  const setTotalRatings = useSetAtom(totalRatingsAtom);

  const fetchRatings = useCallback(async () => {
    try {
      const response = await fetch(`/api/ratings?donorId=${donorId}`);
      if (response.ok) {
        const data = await response.json();
        // Validate with Zod
        const validatedRatings = z.array(ratingSchema).parse(data.ratings);
        setRatings(validatedRatings);
        setAverageRating(data.averageRating);
        setTotalRatings(data.totalRatings);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setRatings([]);
      setAverageRating(0);
      setTotalRatings(0);
    }
  }, [donorId, setRatings, setAverageRating, setTotalRatings]);

  const submitRating = useCallback(
    async (rating: number, comment: string, getToken: () => Promise<string | null>) => {
      try {
        const token = await getToken();
        const response = await fetch('/api/ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            donorId: parseInt(donorId, 10),
            rating,
            comment,
          }),
        });

        if (response.ok) {
          await fetchRatings(); // Refresh ratings
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.error };
        }
      } catch (error) {
        console.error('Error submitting rating:', error);
        return { success: false, error: 'Failed to submit rating' };
      }
    },
    [donorId, fetchRatings]
  );

  return {
    ratings,
    averageRating: useAtomValue(averageRatingAtom),
    totalRatings: useAtomValue(totalRatingsAtom),
    fetchRatings,
    submitRating,
  };
}

// ============================================
// Contact Request Hooks
// ============================================

export function useContactRequests() {
  const [requests, setRequests] = useAtom(contactRequestsAtom);
  const [loading, setLoading] = useAtom(contactRequestsLoadingAtom);

  const fetchContactRequests = useCallback(
    async (getToken: () => Promise<string | null>) => {
      setLoading(true);
      try {
        const token = await getToken();
        const response = await fetch('/api/contact-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Validate with Zod
          const validatedRequests = z.array(contactRequestSchema).parse(data.requests);
          setRequests(validatedRequests);
        }
      } catch (error) {
        console.error('Error fetching contact requests:', error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    },
    [setRequests, setLoading]
  );

  const sendContactRequest = useCallback(
    async (
      donorId: number,
      data: {
        hospital: string;
        address: string;
        contact: string;
        time: string;
        message: string;
      },
      getToken: () => Promise<string | null>
    ) => {
      try {
        const token = await getToken();
        const response = await fetch('/api/contact-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            donorId,
            ...data,
          }),
        });

        if (response.ok) {
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.error };
        }
      } catch (error) {
        console.error('Error sending contact request:', error);
        return { success: false, error: 'Failed to send contact request' };
      }
    },
    []
  );

  return {
    requests,
    loading,
    fetchContactRequests,
    sendContactRequest,
  };
}

// ============================================
// Search Filters Hook
// ============================================

export function useSearchFilters() {
  const [filters, setFilters] = useAtom(searchFiltersAtom);

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>) => {
      setFilters((prev) => ({ ...prev, ...updates }));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters({
      bloodGroup: 'all',
      area: 'all',
      city: 'all',
    });
  }, [setFilters]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
