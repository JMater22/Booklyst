import { Venue } from '../types/venue.types';
import mockVenuesData from '../data/mockVenues.json';
import { storageService } from './storageService';

export const venueService = {
  /**
   * Get all venues (mock + user-created from localStorage)
   */
  getAllVenues(): Venue[] {
    const userVenues = storageService.get<Venue[]>('userVenues') || [];
    return [...mockVenuesData as Venue[], ...userVenues];
  },

  /**
   * Get venue by ID
   */
  getVenueById(id: string): Venue | null {
    const allVenues = this.getAllVenues();
    return allVenues.find(venue => venue.id === id) || null;
  },

  /**
   * Get featured venues
   */
  getFeaturedVenues(): Venue[] {
    return this.getAllVenues().filter(venue => venue.isFeatured);
  },

  /**
   * Search venues by name or location
   */
  searchVenues(query: string): Venue[] {
    const allVenues = this.getAllVenues();
    const lowerQuery = query.toLowerCase();

    return allVenues.filter(venue =>
      venue.name.toLowerCase().includes(lowerQuery) ||
      venue.location.city.toLowerCase().includes(lowerQuery) ||
      venue.location.province.toLowerCase().includes(lowerQuery) ||
      venue.location.address.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filter venues by category
   */
  filterByCategory(category: string): Venue[] {
    if (category === 'all') {
      return this.getAllVenues();
    }
    return this.getAllVenues().filter(venue => venue.category === category);
  },

  /**
   * Filter venues by multiple criteria
   */
  filterVenues(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minCapacity?: number;
    maxCapacity?: number;
    amenities?: string[];
  }): Venue[] {
    let venues = this.getAllVenues();

    if (filters.category && filters.category !== 'all') {
      venues = venues.filter(v => v.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      venues = venues.filter(v => v.priceRange.min >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      venues = venues.filter(v => v.priceRange.max <= filters.maxPrice!);
    }

    if (filters.minCapacity !== undefined) {
      venues = venues.filter(v => v.capacity.max >= filters.minCapacity!);
    }

    if (filters.maxCapacity !== undefined) {
      venues = venues.filter(v => v.capacity.min <= filters.maxCapacity!);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      venues = venues.filter(v =>
        filters.amenities!.every(amenity => v.amenities.includes(amenity))
      );
    }

    return venues;
  },

  /**
   * Sort venues
   */
  sortVenues(venues: Venue[], sortBy: 'price_low' | 'price_high' | 'rating' | 'capacity'): Venue[] {
    const sorted = [...venues];

    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.priceRange.min - b.priceRange.min);
      case 'price_high':
        return sorted.sort((a, b) => b.priceRange.max - a.priceRange.max);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'capacity':
        return sorted.sort((a, b) => b.capacity.max - a.capacity.max);
      default:
        return sorted;
    }
  },

  /**
   * Add venue to favorites
   */
  addToFavorites(venueId: string): void {
    const favorites = storageService.get<string[]>('favorites') || [];
    if (!favorites.includes(venueId)) {
      favorites.push(venueId);
      storageService.set('favorites', favorites);
    }
  },

  /**
   * Remove venue from favorites
   */
  removeFromFavorites(venueId: string): void {
    const favorites = storageService.get<string[]>('favorites') || [];
    const updated = favorites.filter(id => id !== venueId);
    storageService.set('favorites', updated);
  },

  /**
   * Check if venue is in favorites
   */
  isFavorite(venueId: string): boolean {
    const favorites = storageService.get<string[]>('favorites') || [];
    return favorites.includes(venueId);
  },

  /**
   * Get all favorite venues
   */
  getFavoriteVenues(): Venue[] {
    const favorites = storageService.get<string[]>('favorites') || [];
    const allVenues = this.getAllVenues();
    return allVenues.filter(venue => favorites.includes(venue.id));
  }
};
