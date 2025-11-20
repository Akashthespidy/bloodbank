import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bloodGroups = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export const bangladeshCities = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 
  'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Noakhali',
  'Feni', 'Cox\'s Bazar', 'Bogra', 'Kushtia', 'Jessore',
  'Dinajpur', 'Tangail', 'Narayanganj', 'Gazipur', 'Narsingdi'
] as const;

export const bangladeshAreas = [
  'Gulshan', 'Banani', 'Dhanmondi', 'Mohammadpur', 'Mirpur',
  'Uttara', 'Motijheel', 'Old Dhaka', 'New Market', 'Farmgate',
  'Tejgaon', 'Ramna', 'Wari', 'Lalbagh', 'Kotwali',
  'Shahbagh', 'TSC', 'Nilkhet', 'Azimpur', 'Palashi'
] as const; 