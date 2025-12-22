import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  useIonRouter,
  useIonToast,
  useIonAlert,
} from '@ionic/react';
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  locationOutline,
  cashOutline,
  closeCircle,
  checkmarkCircle,
  hourglassOutline,
} from 'ionicons/icons';
import { Booking } from '../../types/booking.types';
import { Venue } from '../../types/venue.types';
import { bookingService } from '../../services/bookingService';
import { venueService } from '../../services/venueService';
import { authService } from '../../services/authService';

import './MyBookings.css';

type BookingTab = 'upcoming' | 'past' | 'cancelled';

const MyBookings: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();

  const [selectedTab, setSelectedTab] = useState<BookingTab>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [selectedTab]);

  const loadBookings = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    let userBookings: Booking[] = [];

    switch (selectedTab) {
      case 'upcoming':
        userBookings = bookingService.getUpcomingBookings(user.id);
        break;
      case 'past':
        userBookings = bookingService.getPastBookings(user.id);
        break;
      case 'cancelled':
        userBookings = bookingService.getCancelledBookings(user.id);
        break;
    }

    setBookings(userBookings);
  };

  const handleRefresh = (event: CustomEvent) => {
    loadBookings();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  const handleCancelBooking = (booking: Booking) => {
    presentAlert({
      header: 'Cancel Booking',
      message: `Are you sure you want to cancel your booking for "${booking.eventName}"? You may be eligible for a partial refund.`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          role: 'destructive',
          handler: () => {
            const success = bookingService.cancelBooking(booking.id);
            if (success) {
              present({
                message: 'Booking cancelled successfully',
                duration: 2000,
                color: 'success',
              });
              loadBookings();
            }
          },
        },
      ],
    });
  };

  const handleViewDetails = (bookingId: string) => {
    router.push(`/booking-details/${bookingId}`);
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return checkmarkCircle;
      case 'pending':
        return hourglassOutline;
      case 'completed':
        return checkmarkCircle;
      case 'cancelled':
        return closeCircle;
      default:
        return hourglassOutline;
    }
  };

  const getStatusLabel = (status: Booking['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderBookingCard = (booking: Booking) => {
    const venue = venueService.getVenueById(booking.venueId);
    if (!venue) return null;

    return (
      <IonCard key={booking.id} className="booking-card">
        <IonCardContent>
          <div className="booking-header">
            <div className="booking-status-badge">
              <IonChip color={getStatusColor(booking.status)}>
                <IonIcon icon={getStatusIcon(booking.status)} />
                <IonLabel>{getStatusLabel(booking.status)}</IonLabel>
              </IonChip>
            </div>
            <div className="booking-reference">
              Ref: {booking.reference}
            </div>
          </div>

          <div className="booking-venue-info">
            <h3>{booking.eventName}</h3>
            <div className="venue-name">
              <IonIcon icon={locationOutline} />
              <span>{venue.name}</span>
            </div>
          </div>

          <div className="booking-details-grid">
            <div className="detail-item">
              <IonIcon icon={calendarOutline} color="primary" />
              <div>
                <div className="detail-label">Date</div>
                <div className="detail-value">
                  {new Date(booking.eventDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="detail-item">
              <IonIcon icon={timeOutline} color="primary" />
              <div>
                <div className="detail-label">Time</div>
                <div className="detail-value">
                  {booking.startTime} - {booking.endTime}
                </div>
              </div>
            </div>

            <div className="detail-item">
              <IonIcon icon={peopleOutline} color="primary" />
              <div>
                <div className="detail-label">Guests</div>
                <div className="detail-value">{booking.guestCount}</div>
              </div>
            </div>

            <div className="detail-item">
              <IonIcon icon={cashOutline} color="primary" />
              <div>
                <div className="detail-label">Total</div>
                <div className="detail-value">
                  ₱{booking.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="booking-actions">
            <IonButton
              fill="outline"
              size="small"
              onClick={() => handleViewDetails(booking.id)}
            >
              View Details
            </IonButton>
            {booking.status === 'confirmed' && selectedTab === 'upcoming' && (
              <IonButton
                fill="clear"
                size="small"
                color="danger"
                onClick={() => handleCancelBooking(booking)}
              >
                Cancel Booking
              </IonButton>
            )}
          </div>
        </IonCardContent>
      </IonCard>
    );
  };

  const renderEmptyState = () => {
    let message = '';
    switch (selectedTab) {
      case 'upcoming':
        message = 'You have no upcoming bookings';
        break;
      case 'past':
        message = 'You have no past bookings';
        break;
      case 'cancelled':
        message = 'You have no cancelled bookings';
        break;
    }

    return (
      <div className="empty-state">
        <IonIcon icon={calendarOutline} className="empty-icon" />
        <h3>{message}</h3>
        <p>Browse venues and make your first booking!</p>
        <IonButton routerLink="/home" expand="block" className="browse-button">
          Browse Venues
        </IonButton>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Bookings</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedTab}
            onIonChange={e => setSelectedTab(e.detail.value as BookingTab)}
          >
            <IonSegmentButton value="upcoming">
              <IonLabel>Upcoming</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="past">
              <IonLabel>Past</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cancelled">
              <IonLabel>Cancelled</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="bookings-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="bookings-container">
          {bookings.length > 0 ? (
            <div className="bookings-list">
              {bookings.map(booking => renderBookingCard(booking))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;
