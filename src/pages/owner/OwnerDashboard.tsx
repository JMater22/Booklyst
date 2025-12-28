import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton as IonHeaderButton,
  useIonRouter,
} from '@ionic/react';
import {
  homeOutline,
  calendarOutline,
  cashOutline,
  addCircleOutline,
  personCircleOutline,
  statsChartOutline,
  checkmarkCircle,
  hourglassOutline,
  logOutOutline,
} from 'ionicons/icons';
import { Venue } from '../../types/venue.types';
import { Booking } from '../../types/booking.types';
import { venueService } from '../../services/venueService';
import { bookingService } from '../../services/bookingService';
import { authService } from '../../services/authService';
import OwnerTabBar from '../../components/navigation/OwnerTabBar';

import './OwnerDashboard.css';

const OwnerDashboard: React.FC = () => {
  const router = useIonRouter();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Get all venues owned by this user
    const allVenues = venueService.getAllVenues();
    const ownerVenues = allVenues.filter(v => v.ownerId === user.id);
    setVenues(ownerVenues);

    // Get all bookings for owner's venues
    let allBookings: Booking[] = [];
    ownerVenues.forEach(venue => {
      const venueBookings = bookingService.getVenueBookings(venue.id);
      allBookings = [...allBookings, ...venueBookings];
    });

    // Sort by date (most recent first)
    allBookings.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setBookings(allBookings);

    // Calculate stats
    const totalRevenue = allBookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;

    setStats({
      totalVenues: ownerVenues.length,
      totalBookings: allBookings.length,
      pendingBookings,
      totalRevenue,
    });
  };

  const handleRefresh = (event: CustomEvent) => {
    loadDashboardData();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  const handleAddVenue = () => {
    router.push('/owner/venues/new');
  };

  const handleViewVenue = (venueId: string) => {
    router.push(`/venue/${venueId}`);
  };

  const handleViewBooking = (bookingId: string) => {
    router.push(`/booking-details/${bookingId}`);
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
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
      default:
        return hourglassOutline;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Owner Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonHeaderButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonHeaderButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="owner-dashboard-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="dashboard-container">
          {/* Stats Cards */}
          <div className="stats-grid">
            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-icon-wrapper" style={{ background: '#e0e7ff' }}>
                  <IonIcon icon={homeOutline} color="primary" />
                </div>
                <div className="stat-value">{stats.totalVenues}</div>
                <div className="stat-label">Total Venues</div>
              </IonCardContent>
            </IonCard>

            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
                  <IonIcon icon={calendarOutline} style={{ color: '#f59e0b' }} />
                </div>
                <div className="stat-value">{stats.totalBookings}</div>
                <div className="stat-label">Total Bookings</div>
              </IonCardContent>
            </IonCard>

            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-icon-wrapper" style={{ background: '#fef2f2' }}>
                  <IonIcon icon={hourglassOutline} style={{ color: '#ef4444' }} />
                </div>
                <div className="stat-value">{stats.pendingBookings}</div>
                <div className="stat-label">Pending</div>
              </IonCardContent>
            </IonCard>

            <IonCard className="stat-card">
              <IonCardContent>
                <div className="stat-icon-wrapper" style={{ background: '#d1fae5' }}>
                  <IonIcon icon={cashOutline} style={{ color: '#10b981' }} />
                </div>
                <div className="stat-value">₱{(stats.totalRevenue / 1000).toFixed(0)}K</div>
                <div className="stat-label">Revenue</div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Quick Actions */}
          <div className="section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions">
              <IonButton
                expand="block"
                onClick={handleAddVenue}
                className="action-button"
              >
                <IonIcon icon={addCircleOutline} slot="start" />
                Add New Venue
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                routerLink="/owner/venues"
                className="action-button"
              >
                <IonIcon icon={homeOutline} slot="start" />
                Manage Venues
              </IonButton>
            </div>
          </div>

          {/* My Venues */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">My Venues</h2>
              {venues.length > 0 && (
                <IonButton
                  fill="clear"
                  size="small"
                  routerLink="/owner/venues"
                >
                  View All
                </IonButton>
              )}
            </div>

            {venues.length > 0 ? (
              <div className="venues-list">
                {venues.slice(0, 3).map(venue => (
                  <IonCard
                    key={venue.id}
                    className="venue-card-compact"
                    onClick={() => handleViewVenue(venue.id)}
                  >
                    <IonCardContent>
                      <div className="venue-compact-content">
                        <div>
                          <h3>{venue.name}</h3>
                          <p className="venue-location">{venue.location.city}</p>
                        </div>
                        <div className="venue-stats">
                          <IonIcon icon={statsChartOutline} />
                          <span>{venue.rating} ★</span>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            ) : (
              <div className="empty-state-small">
                <p>No venues yet. Add your first venue to get started!</p>
                <IonButton onClick={handleAddVenue} size="small">
                  <IonIcon icon={addCircleOutline} slot="start" />
                  Add Venue
                </IonButton>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Recent Bookings</h2>
            </div>

            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.slice(0, 5).map(booking => {
                  const venue = venues.find(v => v.id === booking.venueId);
                  return (
                    <IonCard
                      key={booking.id}
                      className="booking-card-compact"
                      onClick={() => handleViewBooking(booking.id)}
                    >
                      <IonCardContent>
                        <div className="booking-compact-header">
                          <IonChip color={getStatusColor(booking.status)} className="status-chip">
                            <IonIcon icon={getStatusIcon(booking.status)} />
                            {booking.status}
                          </IonChip>
                          <span className="booking-reference">{booking.reference}</span>
                        </div>
                        <h3 className="booking-event-name">{booking.eventName}</h3>
                        <p className="booking-venue-name">{venue?.name || 'Unknown Venue'}</p>
                        <div className="booking-compact-details">
                          <span>
                            <IonIcon icon={calendarOutline} />
                            {new Date(booking.eventDate).toLocaleDateString()}
                          </span>
                          <span>
                            <IonIcon icon={cashOutline} />
                            ₱{booking.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state-small">
                <p>No bookings yet.</p>
              </div>
            )}
          </div>
        </div>
      </IonContent>
      <OwnerTabBar />
    </IonPage>
  );
};

export default OwnerDashboard;
