import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { z } from 'zod';

// ============================================
// Zod Schemas for Type Safety
// ============================================

export const donorSchema = z.object({
  id: z.number(),
  name: z.string(),
  bloodGroup: z.string(),
  area: z.string(),
  city: z.string(),
  createdAt: z.string(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  isDonor: z.boolean().nullable().optional(),
});

export const ratingSchema = z.object({
  id: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable(),
  createdAt: z.string(),
  raterName: z.string(),
});

export const contactRequestSchema = z.object({
  id: z.number(),
  requesterId: z.number(),
  donorId: z.number(),
  status: z.string(),
  message: z.string().nullable(),
  createdAt: z.string(),
});

export const searchFiltersSchema = z.object({
  bloodGroup: z.string().default('all'),
  area: z.string().default('all'),
  city: z.string().default('all'),
});

// ============================================
// Type Inference from Schemas
// ============================================

export type Donor = z.infer<typeof donorSchema>;
export type Rating = z.infer<typeof ratingSchema>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// ============================================
// Jotai Atoms
// ============================================

// Donor-related atoms
export const donorsAtom = atom<Donor[]>([]);
export const selectedDonorAtom = atom<Donor | null>(null);
export const donorsLoadingAtom = atom(false);

// Search filters atom with localStorage persistence
export const searchFiltersAtom = atomWithStorage<SearchFilters>('bloodbank-search-filters', {
  bloodGroup: 'all',
  area: 'all',
  city: 'all',
});

// Rating-related atoms
export const ratingsAtom = atom<Rating[]>([]);
export const averageRatingAtom = atom(0);
export const totalRatingsAtom = atom(0);

// Contact request atoms
export const contactRequestsAtom = atom<ContactRequest[]>([]);
export const contactRequestsLoadingAtom = atom(false);

// UI state atoms
export const showBulkMessageAtom = atom(false);
export const bulkMessageAtom = atom('');
export const sendingBulkAtom = atom(false);

// Derived atoms (computed values)
export const filteredDonorsAtom = atom((get) => {
  const donors = get(donorsAtom);
  const filters = get(searchFiltersAtom);

  return donors.filter((donor) => {
    const matchesBloodGroup =
      filters.bloodGroup === 'all' || donor.bloodGroup === filters.bloodGroup;
    const matchesArea = filters.area === 'all' || donor.area === filters.area;
    const matchesCity = filters.city === 'all' || donor.city === filters.city;

    return matchesBloodGroup && matchesArea && matchesCity;
  });
});

export const donorCountAtom = atom((get) => get(filteredDonorsAtom).length);

// Atom for available areas based on selected city
export const availableAreasAtom = atom<string[]>([]);
