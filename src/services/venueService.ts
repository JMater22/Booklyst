import { Venue } from '../types/venue.types';
import mockVenuesData from '../data/mockVenues.json';
import { storageService } from './storageService';
import { bookingService } from './bookingService';

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
  },

  /**
   * Get all venues for a specific owner
   */
  getOwnerVenues(ownerId: string): Venue[] {
    const allVenues = this.getAllVenues();
    return allVenues
      .filter(v => v.ownerId === ownerId)
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest first
      });
  },

  /**
   * Update venue (supports both user-created and mock venues)
   */
  updateVenue(venueId: string, updates: Partial<Venue>): Venue | null {
    const userVenues = storageService.get<Venue[]>('userVenues') || [];
    const venueIndex = userVenues.findIndex(v => v.id === venueId);

    if (venueIndex !== -1) {
      // Update existing user venue
      userVenues[venueIndex] = { ...userVenues[venueIndex], ...updates };
      storageService.set('userVenues', userVenues);
      return userVenues[venueIndex];
    } else {
      // Check if it's a mock venue - create editable copy
      const mockVenue = (mockVenuesData as Venue[]).find(v => v.id === venueId);
      if (mockVenue) {
        const updatedVenue = { ...mockVenue, ...updates };
        userVenues.push(updatedVenue);
        storageService.set('userVenues', userVenues);
        return updatedVenue;
      }
    }

    return null;
  },

  /**
   * Delete venue (only user-created venues)
   */
  deleteVenue(venueId: string): boolean {
    const userVenues = storageService.get<Venue[]>('userVenues') || [];
    const filtered = userVenues.filter(v => v.id !== venueId);

    if (filtered.length < userVenues.length) {
      storageService.set('userVenues', filtered);
      return true;
    }

    return false;
  },

  /**
   * Check if venue can be deleted
   */
  canDeleteVenue(venueId: string): { canDelete: boolean; reason?: string } {
    const bookings = bookingService.getVenueBookings(venueId);

    if (bookings.length > 0) {
      return {
        canDelete: false,
        reason: `This venue has ${bookings.length} existing booking(s) and cannot be deleted.`
      };
    }

    const userVenues = storageService.get<Venue[]>('userVenues') || [];
    const isUserVenue = userVenues.some(v => v.id === venueId);

    if (!isUserVenue) {
      return {
        canDelete: false,
        reason: 'System venues cannot be deleted.'
      };
    }

    return { canDelete: true };
  },

  /**
   * Update venue images
   */
  updateVenueImages(venueId: string, images: string[], coverImage: string): Venue | null {
    return this.updateVenue(venueId, { images, coverImage });
  }
};
