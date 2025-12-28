import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonButton,
  useIonRouter,
} from '@ionic/react';
import { heartOutline, logOutOutline } from 'ionicons/icons';
import { Venue } from '../../types/venue.types';
import { venueService } from '../../services/venueService';
import { authService } from '../../services/authService';
import VenueCard from '../../components/venue/VenueCard';
import TabBar from '../../components/navigation/TabBar';

import './Favorites.css';

const Favorites: React.FC = () => {
  const router = useIonRouter();
  const [favorites, setFavorites] = useState<Venue[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favoriteVenues = venueService.getFavoriteVenues();
    setFavorites(favoriteVenues);
  };

  const handleRefresh = (event: CustomEvent) => {
    loadFavorites();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  const handleVenueClick = (venueId: string) => {
    router.push(`/venue/${venueId}`);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const renderEmptyState = () => (
    <div className="empty-state">
      <IonIcon icon={heartOutline} className="empty-icon" />
      <h3>No favorites yet</h3>
      <p>Start adding venues to your favorites by tapping the heart icon!</p>
      <IonButton routerLink="/home" expand="block" className="browse-button">
        Browse Venues
      </IonButton>
    </div>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>My Favorites</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="favorites-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="favorites-container">
          {favorites.length > 0 ? (
            <>
              <div className="favorites-header">
                <p className="favorites-count">
                  {favorites.length} {favorites.length === 1 ? 'venue' : 'venues'}
                </p>
              </div>
              <div className="favorites-grid">
                {favorites.map(venue => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onClick={() => handleVenueClick(venue.id)}
                    onFavoriteToggle={loadFavorites}
                  />
                ))}
              </div>
            </>
          ) : (
            renderEmptyState()
          )}
        </div>
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Favorites;
