import { Review } from '../types/booking.types';
import { storageService } from './storageService';
import mockReviews from '../data/mockReviews.json';

export const reviewService = {
  /**
   * Get all reviews
   */
  getAllReviews(): Review[] {
    const userReviews = storageService.get<Review[]>('reviews') || [];
    return [...(mockReviews as Review[]), ...userReviews];
  },

  /**
   * Get reviews for a specific venue
   */
  getVenueReviews(venueId: string): Review[] {
    const allReviews = this.getAllReviews();
    return allReviews.filter(review => review.venueId === venueId);
  },

  /**
   * Get reviews by a specific customer
   */
  getCustomerReviews(customerId: string): Review[] {
    const allReviews = this.getAllReviews();
    return allReviews.filter(review => review.customerId === customerId);
  },

  /**
   * Submit a new review
   */
  submitReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Review {
    const userReviews = storageService.get<Review[]>('reviews') || [];

    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    userReviews.push(newReview);
    storageService.set('reviews', userReviews);

    return newReview;
  },

  /**
   * Check if user has reviewed a venue
   */
  hasReviewed(customerId: string, venueId: string): boolean {
    const allReviews = this.getAllReviews();
    return allReviews.some(
      review => review.customerId === customerId && review.venueId === venueId
    );
  },

  /**
   * Calculate average rating for a venue
   */
  getAverageRating(venueId: string): { average: number; count: number } {
    const reviews = this.getVenueReviews(venueId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = Math.round((sum / reviews.length) * 10) / 10;

    return { average, count: reviews.length };
  },
};
