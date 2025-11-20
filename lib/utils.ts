import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export const bangladeshCities = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 
  'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj', 'Bogra'
] as const;

export const bangladeshAreas = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara', 'Mohammadpur',
  'Badda', 'Rampura', 'Motijheel', 'Tejgaon', 'Farmgate', 'Kawran Bazar',
  'Agrabad', 'Panchlaish', 'Khulshi', 'Halishahar', 'Zindabazar', 'Ambarkhana'
] as const;
