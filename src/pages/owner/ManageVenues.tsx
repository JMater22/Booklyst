import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonButton as IonHeaderButton,
  useIonRouter,
  useIonToast,
  useIonAlert,
} from '@ionic/react';
import {
  addCircleOutline,
  createOutline,
  trashOutline,
  eyeOutline,
  starOutline,
  locationOutline,
  personCircleOutline,
  logOutOutline,
} from 'ionicons/icons';
import { Venue } from '../../types/venue.types';
import { venueService } from '../../services/venueService';
import { authService } from '../../services/authService';
import OwnerTabBar from '../../components/navigation/OwnerTabBar';

import './ManageVenues.css';

const ManageVenues: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    filterAndSortVenues();
  }, [venues, searchText, sortBy]);

  const loadVenues = () => {
    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const ownerVenues = venueService.getOwnerVenues(user.id);
    setVenues(ownerVenues);
  };

  const filterAndSortVenues = () => {
    let filtered = [...venues];

    // Apply search filter
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(query) ||
        venue.location.city.toLowerCase().includes(query) ||
        venue.location.address.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateA - dateB;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredVenues(filtered);
  };

  const handleRefresh = (event: CustomEvent) => {
    loadVenues();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  const handleAddVenue = () => {
    router.push('/owner/venues/new');
  };

  const handleEditVenue = (venueId: string) => {
    router.push(`/owner/venues/edit/${venueId}`);
  };

  const handleViewVenue = (venueId: string) => {
    router.push(`/venue/${venueId}`);
  };

  const handleDeleteVenue = (venue: Venue) => {
    const checkResult = venueService.canDeleteVenue(venue.id);

    if (!checkResult.canDelete) {
      presentAlert({
        header: 'Cannot Delete Venue',
        message: checkResult.reason,
        buttons: ['OK'],
      });
      return;
    }

    presentAlert({
      header: 'Delete Venue',
      message: `Are you sure you want to delete "${venue.name}"? This action cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            const success = venueService.deleteVenue(venue.id);
            if (success) {
              present({
                message: 'Venue deleted successfully!',
                duration: 2000,
                color: 'success',
              });
              loadVenues();
            } else {
              present({
                message: 'Failed to delete venue',
                duration: 2000,
                color: 'danger',
              });
            }
          },
        },
      ],
    });
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleLogout = () => {
    presentAlert({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          role: 'destructive',
          handler: () => {
            authService.logout();
            window.location.href = '/login';
          },
        },
      ],
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      ballroom: 'Ballroom',
      garden: 'Garden',
      conference: 'Conference',
      restaurant: 'Restaurant',
      events_hall: 'Events Hall',
      wedding_hall: 'Wedding Hall',
    };
    return labels[category] || category;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>My Venues</IonTitle>
          <IonButtons slot="end">
            <IonHeaderButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonHeaderButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="manage-venues-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="manage-venues-container">
          {/* Header Section */}
          <div className="header-section">
            <IonButton
              expand="block"
              onClick={handleAddVenue}
              className="add-venue-button"
            >
              <IonIcon icon={addCircleOutline} slot="start" />
              Add New Venue
            </IonButton>
          </div>

          {/* Search and Sort */}
          <div className="filters-section">
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Search venues..."
              className="venue-searchbar"
            />

            <IonSelect
              value={sortBy}
              onIonChange={(e) => setSortBy(e.detail.value)}
              interface="popover"
              className="sort-select"
            >
              <IonSelectOption value="newest">Newest First</IonSelectOption>
              <IonSelectOption value="oldest">Oldest First</IonSelectOption>
              <IonSelectOption value="name">Name (A-Z)</IonSelectOption>
              <IonSelectOption value="rating">Highest Rated</IonSelectOption>
            </IonSelect>
          </div>

          {/* Venues Grid */}
          {filteredVenues.length > 0 ? (
            <div className="venues-grid">
              {filteredVenues.map((venue) => (
                <IonCard key={venue.id} className="venue-card">
                  <div
                    className="venue-image"
                    style={{ backgroundImage: `url(${venue.coverImage})` }}
                  />
                  <IonCardContent>
                    <h2 className="venue-name">{venue.name}</h2>
                    <IonChip color="primary" className="category-chip">
                      {getCategoryLabel(venue.category)}
                    </IonChip>

                    <div className="venue-info">
                      <div className="info-item">
                        <IonIcon icon={locationOutline} />
                        <span>{venue.location.city}</span>
                      </div>
                      <div className="info-item">
                        <IonIcon icon={starOutline} />
                        <span>
                          {venue.rating} ({venue.totalReviews})
                        </span>
                      </div>
                    </div>

                    <div className="venue-price">
                      ₱{venue.priceRange.min.toLocaleString()} - ₱
                      {venue.priceRange.max.toLocaleString()}
                    </div>

                    <div className="venue-actions">
                      <IonButton
                        size="small"
                        fill="outline"
                        onClick={() => handleEditVenue(venue.id)}
                      >
                        <IonIcon icon={createOutline} slot="start" />
                        Edit
                      </IonButton>
                      <IonButton
                        size="small"
                        fill="outline"
                        color="danger"
                        onClick={() => handleDeleteVenue(venue)}
                      >
                        <IonIcon icon={trashOutline} slot="start" />
                        Delete
                      </IonButton>
                      <IonButton
                        size="small"
                        fill="clear"
                        onClick={() => handleViewVenue(venue.id)}
                      >
                        <IonIcon icon={eyeOutline} slot="start" />
                        View
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <IonIcon icon={addCircleOutline} className="empty-icon" />
              <h2>No venues found</h2>
              <p>
                {searchText.trim()
                  ? 'Try adjusting your search criteria'
                  : 'Create your first venue to start receiving bookings'}
              </p>
              {!searchText.trim() && (
                <IonButton onClick={handleAddVenue}>
                  <IonIcon icon={addCircleOutline} slot="start" />
                  Create Venue
                </IonButton>
              )}
            </div>
          )}
        </div>
      </IonContent>
      <OwnerTabBar />
    </IonPage>
  );
};

export default ManageVenues;
