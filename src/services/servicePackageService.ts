import { ServicePackage } from '../types/venue.types';
import { storageService } from './storageService';
import mockPackagesData from '../data/mockServicePackages.json';

export const servicePackageService = {
  /**
   * Get all packages for a venue
   */
  getVenuePackages(venueId: string): ServicePackage[] {
    const userPackages = storageService.get<ServicePackage[]>('servicePackages') || [];
    const mockPackages = mockPackagesData as ServicePackage[];

    const allPackages = [...mockPackages, ...userPackages];
    return allPackages.filter(pkg => pkg.venueId === venueId);
  },

  /**
   * Get package by ID
   */
  getPackageById(packageId: string): ServicePackage | null {
    const userPackages = storageService.get<ServicePackage[]>('servicePackages') || [];
    const mockPackages = mockPackagesData as ServicePackage[];

    const allPackages = [...mockPackages, ...userPackages];
    return allPackages.find(pkg => pkg.id === packageId) || null;
  },

  /**
   * Create new service package
   */
  createPackage(packageData: Omit<ServicePackage, 'id'>): ServicePackage {
    const userPackages = storageService.get<ServicePackage[]>('servicePackages') || [];

    const newPackage: ServicePackage = {
      ...packageData,
      id: `pkg_${Date.now()}`
    };

    userPackages.push(newPackage);
    storageService.set('servicePackages', userPackages);

    return newPackage;
  },

  /**
   * Update package
   */
  updatePackage(packageId: string, updates: Partial<ServicePackage>): ServicePackage | null {
    const userPackages = storageService.get<ServicePackage[]>('servicePackages') || [];
    const packageIndex = userPackages.findIndex(pkg => pkg.id === packageId);

    if (packageIndex !== -1) {
      userPackages[packageIndex] = { ...userPackages[packageIndex], ...updates };
      storageService.set('servicePackages', userPackages);
      return userPackages[packageIndex];
    }

    return null;
  },

  /**
   * Delete package
   */
  deletePackage(packageId: string): boolean {
    const userPackages = storageService.get<ServicePackage[]>('servicePackages') || [];
    const filtered = userPackages.filter(pkg => pkg.id !== packageId);

    if (filtered.length < userPackages.length) {
      storageService.set('servicePackages', filtered);
      return true;
    }

    return false;
  },

  /**
   * Check if package can be deleted
   */
  canDeletePackage(packageId: string): { canDelete: boolean; reason?: string } {
    const allBookings = storageService.get<any[]>('bookings') || [];
    const usedInBookings = allBookings.some(booking =>
      booking.services && booking.services.includes(packageId)
    );

    if (usedInBookings) {
      return {
        canDelete: false,
        reason: 'This package is used in existing bookings and cannot be deleted.'
      };
    }

    const userPackages = storageService.get<ServicePackage[]>('servicePackages') || [];
    const isUserPackage = userPackages.some(pkg => pkg.id === packageId);

    if (!isUserPackage) {
      return {
        canDelete: false,
        reason: 'System packages cannot be deleted.'
      };
    }

    return { canDelete: true };
  }
};
