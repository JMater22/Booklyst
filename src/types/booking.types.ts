export interface Booking {
  id: string;
  reference: string;
  customerId: string;
  venueId: string;
  eventName: string;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'conference' | 'other';
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  services: string[]; // Service package IDs
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid' | 'refunded';
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  venueId: string;
  customerId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  photos: string[];
  eventType: string;
  venueQualityRating?: number;
  serviceQualityRating?: number;
  valueRating?: number;
  cleanlinessRating?: number;
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
  isRead?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmed' | 'booking_approved' | 'booking_rejected' | 'payment_received' | 'new_message' | 'review_received';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}
