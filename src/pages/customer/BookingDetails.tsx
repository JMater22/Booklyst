import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  useIonRouter,
  useIonToast,
  useIonAlert,
} from '@ionic/react';
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  locationOutline,
  checkmarkCircle,
  hourglassOutline,
  closeCircle,
  informationCircleOutline,
} from 'ionicons/icons';
import { Booking } from '../../types/booking.types';
import { Venue } from '../../types/venue.types';
import { bookingService } from '../../services/bookingService';
import { venueService } from '../../services/venueService';
import { authService } from '../../services/authService';

import './BookingDetails.css';

interface RouteParams {
  id: string;
}

const BookingDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const router = useIonRouter();
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);

  useEffect(() => {
    loadBookingDetails();
  }, [id]);

  const loadBookingDetails = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const bookingData = bookingService.getBookingById(id);
    if (!bookingData) {
      present({
        message: 'Booking not found',
        duration: 2000,
        color: 'danger',
      });
      router.push('/bookings');
      return;
    }

    const venueData = venueService.getVenueById(bookingData.venueId);
    setBooking(bookingData);
    setVenue(venueData);
  };

  const handleCancelBooking = () => {
    if (!booking) return;

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
              loadBookingDetails();
            }
          },
        },
      ],
    });
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

  if (!booking || !venue) {
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/bookings" />
          </IonButtons>
          <IonTitle>Booking Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="booking-details-content">
        <div className="booking-details-container">
          {/* Status Card */}
          <IonCard className="status-card">
            <IonCardContent>
              <div className="status-header">
                <IonChip color={getStatusColor(booking.status)} className="status-chip-large">
                  <IonIcon icon={getStatusIcon(booking.status)} />
                  <IonLabel>{booking.status.toUpperCase()}</IonLabel>
                </IonChip>
                <div className="booking-reference">
                  <span className="label">Booking Reference</span>
                  <span className="value">{booking.reference}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Venue Info */}
          <IonCard>
            <IonCardContent>
              <h2 className="section-title">Venue</h2>
              <div className="venue-info">
                <h3>{venue.name}</h3>
                <div className="venue-detail">
                  <IonIcon icon={locationOutline} />
                  <span>{venue.location.address}, {venue.location.city}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Event Details */}
          <IonCard>
            <IonCardContent>
              <h2 className="section-title">Event Details</h2>
              <IonList lines="none" className="details-list">
                <IonItem>
                  <IonIcon icon={informationCircleOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p className="detail-label">Event Name</p>
                    <h3 className="detail-value">{booking.eventName}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={informationCircleOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p className="detail-label">Event Type</p>
                    <h3 className="detail-value">{booking.eventType}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={calendarOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p className="detail-label">Date</p>
                    <h3 className="detail-value">
                      {new Date(booking.eventDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={timeOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p className="detail-label">Time</p>
                    <h3 className="detail-value">{booking.startTime} - {booking.endTime}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={peopleOutline} slot="start" color="primary" />
                  <IonLabel>
                    <p className="detail-label">Guest Count</p>
                    <h3 className="detail-value">{booking.guestCount} guests</h3>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          {/* Payment Details */}
          <IonCard>
            <IonCardContent>
              <h2 className="section-title">Payment Details</h2>
              <div className="payment-breakdown">
                <div className="payment-row">
                  <span>Total Amount</span>
                  <span className="amount">₱{booking.totalAmount.toLocaleString()}</span>
                </div>
                <div className="payment-row deposit">
                  <span>Deposit Paid (30%)</span>
                  <span className="amount">₱{booking.depositAmount.toLocaleString()}</span>
                </div>
                <div className="payment-row balance">
                  <span>Balance Due</span>
                  <span className="amount">₱{booking.balanceAmount.toLocaleString()}</span>
                </div>
                <div className="payment-status">
                  <IonChip color={booking.paymentStatus === 'fully_paid' ? 'success' : 'warning'}>
                    {booking.paymentStatus === 'fully_paid' ? 'Fully Paid' : booking.paymentStatus === 'deposit_paid' ? 'Deposit Paid' : 'Unpaid'}
                  </IonChip>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Special Requests */}
          {booking.specialRequests && (
            <IonCard>
              <IonCardContent>
                <h2 className="section-title">Special Requests</h2>
                <p className="special-requests">{booking.specialRequests}</p>
              </IonCardContent>
            </IonCard>
          )}

          {/* Cancellation Info */}
          {booking.status === 'cancelled' && booking.cancellationReason && (
            <IonCard className="cancellation-card">
              <IonCardContent>
                <h2 className="section-title">Cancellation Details</h2>
                <p className="cancellation-reason">{booking.cancellationReason}</p>
                <p className="cancellation-date">
                  Cancelled on: {new Date(booking.cancelledAt!).toLocaleDateString()}
                </p>
              </IonCardContent>
            </IonCard>
          )}

          {/* Actions */}
          {booking.status === 'confirmed' && (
            <div className="booking-actions">
              <IonButton
                expand="block"
                color="danger"
                fill="outline"
                onClick={handleCancelBooking}
              >
                Cancel Booking
              </IonButton>
            </div>
          )}

          {booking.status === 'pending' && (
            <div className="booking-info">
              <IonIcon icon={informationCircleOutline} color="warning" />
              <p>Your booking is pending confirmation from the venue owner.</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingDetails;
