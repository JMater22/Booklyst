import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonChip } from '@ionic/react';
import { locationOutline, peopleOutline, star, heartOutline, heart } from 'ionicons/icons';
import { Venue } from '../../types/venue.types';
import { venueService } from '../../services/venueService';
import './VenueCard.css';

interface VenueCardProps {
  venue: Venue;
  onClick?: () => void;
  onFavoriteToggle?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onClick, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = React.useState(venueService.isFavorite(venue.id));
  const [imageError, setImageError] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isFavorite) {
      venueService.removeFromFavorites(venue.id);
    } else {
      venueService.addToFavorites(venue.id);
    }

    setIsFavorite(!isFavorite);
    onFavoriteToggle?.();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (min: number, max: number) => {
    return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'ballroom': 'Ballroom',
      'garden': 'Garden',
      'conference': 'Conference',
      'restaurant': 'Restaurant',
      'events_hall': 'Events Hall'
    };
    return labels[category] || category;
  };

  return (
    <IonCard className="venue-card" onClick={onClick}>
      <div className="venue-card-image-wrapper">
        {!imageError ? (
          <img
            src={venue.coverImage || venue.images[0]}
            alt={venue.name}
            className="venue-card-image"
            onError={handleImageError}
          />
        ) : (
          <div className="venue-card-image-placeholder">
            <div className="placeholder-text">{venue.name.charAt(0)}</div>
          </div>
        )}
        <IonIcon
          icon={isFavorite ? heart : heartOutline}
          className={`venue-card-favorite ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        />
        {venue.isFeatured && (
          <IonChip className="venue-card-featured-badge" color="warning">
            Featured
          </IonChip>
        )}
      </div>

      <IonCardContent className="venue-card-content">
        <div className="venue-card-header">
          <h3 className="venue-card-title">{venue.name}</h3>
          <IonChip className="venue-card-category" color="primary">
            {getCategoryLabel(venue.category)}
          </IonChip>
        </div>

        <div className="venue-card-location">
          <IonIcon icon={locationOutline} />
          <span>{venue.location.city}, {venue.location.province}</span>
        </div>

        <div className="venue-card-info">
          <div className="venue-card-rating">
            <IonIcon icon={star} color="warning" />
            <span>{venue.rating}</span>
            <span className="text-secondary">({venue.totalReviews} reviews)</span>
          </div>

          <div className="venue-card-capacity">
            <IonIcon icon={peopleOutline} />
            <span>{venue.capacity.min}-{venue.capacity.max} guests</span>
          </div>
        </div>

        <div className="venue-card-price">
          {formatPrice(venue.priceRange.min, venue.priceRange.max)}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default VenueCard;
