import { Booking } from '../types/booking.types';
import { storageService } from './storageService';

export const bookingService = {
  /**
   * Get all bookings for current user
   */
  getUserBookings(userId: string): Booking[] {
    const allBookings = storageService.get<Booking[]>('bookings') || [];
    return allBookings.filter(booking => booking.customerId === userId);
  },

  /**
   * Get booking by ID
   */
  getBookingById(bookingId: string): Booking | null {
    const allBookings = storageService.get<Booking[]>('bookings') || [];
    return allBookings.find(booking => booking.id === bookingId) || null;
  },

  /**
   * Create new booking
   */
  createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'reference'>): Booking {
    const allBookings = storageService.get<Booking[]>('bookings') || [];

    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      reference: `BKL${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
    };

    allBookings.push(newBooking);
    storageService.set('bookings', allBookings);

    return newBooking;
  },

  /**
   * Update booking status
   */
  updateBookingStatus(
    bookingId: string,
    status: Booking['status']
  ): boolean {
    const allBookings = storageService.get<Booking[]>('bookings') || [];
    const bookingIndex = allBookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) return false;

    allBookings[bookingIndex].status = status;
    storageService.set('bookings', allBookings);

    return true;
  },

  /**
   * Cancel booking
   */
  cancelBooking(bookingId: string): boolean {
    return this.updateBookingStatus(bookingId, 'cancelled');
  },

  /**
   * Get bookings by venue (for venue owners)
   */
  getVenueBookings(venueId: string): Booking[] {
    const allBookings = storageService.get<Booking[]>('bookings') || [];
    return allBookings.filter(booking => booking.venueId === venueId);
  },

  /**
   * Calculate booking total
   */
  calculateTotal(
    venuePrice: number,
    services: { price: number }[],
    guestCount?: number
  ): {
    subtotal: number;
    serviceFee: number;
    total: number;
    deposit: number;
    balance: number;
  } {
    let subtotal = venuePrice;

    // Add service prices
    services.forEach(service => {
      subtotal += service.price;
    });

    const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
    const total = subtotal + serviceFee;
    const deposit = Math.round(total * 0.3); // 30% deposit
    const balance = total - deposit;

    return {
      subtotal,
      serviceFee,
      total,
      deposit,
      balance,
    };
  },

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings(userId: string): Booking[] {
    const userBookings = this.getUserBookings(userId);
    const now = new Date();

    return userBookings.filter(booking => {
      const eventDate = new Date(booking.eventDate);
      return (
        eventDate >= now &&
        (booking.status === 'confirmed' || booking.status === 'pending')
      );
    }).sort((a, b) =>
      new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  },

  /**
   * Get past bookings
   */
  getPastBookings(userId: string): Booking[] {
    const userBookings = this.getUserBookings(userId);
    const now = new Date();

    return userBookings.filter(booking => {
      const eventDate = new Date(booking.eventDate);
      return eventDate < now || booking.status === 'completed';
    }).sort((a, b) =>
      new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );
  },

  /**
   * Get cancelled bookings
   */
  getCancelledBookings(userId: string): Booking[] {
    const userBookings = this.getUserBookings(userId);
    return userBookings.filter(booking => booking.status === 'cancelled')
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },
};
