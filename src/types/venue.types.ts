export interface VenueLocation {
  city: string;
  province: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface VenueCapacity {
  min: number;
  max: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface Venue {
  id: string;
  name: string;
  category: 'restaurant' | 'ballroom' | 'garden' | 'conference' | 'events_hall' | 'wedding_hall';
  location: VenueLocation;
  rating: number;
  totalReviews: number;
  capacity: VenueCapacity;
  priceRange: PriceRange;
  images: string[];
  coverImage: string;
  amenities: string[];
  description: string;
  isFeatured: boolean;
  ownerId: string;
  houseRules?: string;
  operatingHours?: string;
  createdAt?: string;
}

export interface ServicePackage {
  id: string;
  venueId: string;
  name: string;
  type: 'catering' | 'decoration' | 'photography' | 'entertainment' | 'other';
  description: string;
  price?: number;
  pricePerPerson?: number;
  pricingUnit?: 'flat_rate' | 'per_person' | 'per_hour';
  inclusions?: string[];
}
