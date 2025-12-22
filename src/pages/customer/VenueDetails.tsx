import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonChip,
  IonCard,
  IonCardContent,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import {
  heartOutline,
  heart,
  shareOutline,
  locationOutline,
  peopleOutline,
  cashOutline,
  star,
  timeOutline,
  checkmarkCircle,
} from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { Venue } from '../../types/venue.types';
import { Review } from '../../types/booking.types';
import { venueService } from '../../services/venueService';
import mockReviews from '../../data/mockReviews.json';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './VenueDetails.css';

const VenueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const [present] = useIonToast();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadVenueDetails();
  }, [id]);

  const loadVenueDetails = () => {
    const venueData = venueService.getVenueById(id);
    if (!venueData) {
      present({
        message: 'Venue not found',
        duration: 2000,
        color: 'danger',
      });
      router.goBack();
      return;
    }

    setVenue(venueData);
    setIsFavorite(venueService.isFavorite(id));

    // Load reviews for this venue
    const venueReviews = (mockReviews as Review[]).filter(
      (review) => review.venueId === id
    );
    setReviews(venueReviews);
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      venueService.removeFromFavorites(id);
      present({
        message: 'Removed from favorites',
        duration: 1500,
        color: 'medium',
      });
    } else {
      venueService.addToFavorites(id);
      present({
        message: 'Added to favorites',
        duration: 1500,
        color: 'success',
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    present({
      message: 'Share feature coming soon!',
      duration: 1500,
      color: 'medium',
    });
  };

  const handleBookNow = () => {
    router.push(`/booking/${id}`);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const getAmenityIcon = (amenity: string) => {
    // Map amenity names to icons
    const iconMap: { [key: string]: string } = {
      wifi: 'wifi',
      parking: 'car',
      ac: 'snow',
      sound_system: 'volume-high',
      kitchen: 'restaurant',
      stage: 'mic',
      projector: 'tv',
      led_lights: 'bulb',
      outdoor_space: 'leaf',
      gazebo: 'home',
      restrooms: 'water',
      bridal_suite: 'bed',
      valet: 'key',
      whiteboard: 'easel',
      video_conferencing: 'videocam',
      catering_area: 'fast-food',
    };
    return iconMap[amenity] || 'checkmark-circle';
  };

  const getAmenityLabel = (amenity: string) => {
    return amenity.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (!venue) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p>Loading...</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Venue Details</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleFavoriteToggle}>
              <IonIcon icon={isFavorite ? heart : heartOutline} color="light" />
            </IonButton>
            <IonButton onClick={handleShare}>
              <IonIcon icon={shareOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="venue-details-content" fullscreen>
        {/* Image Gallery */}
        <div className="venue-gallery">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
            className="gallery-swiper"
          >
            {venue.images.map((image, index) => (
              <SwiperSlide key={index}>
                {!imageError[index] ? (
                  <img
                    src={image}
                    alt={`${venue.name} - ${index + 1}`}
                    className="gallery-image"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="gallery-placeholder">
                    <div className="placeholder-text">{venue.name.charAt(0)}</div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="venue-details-container">
          {/* Venue Header */}
          <div className="venue-header">
            <div className="venue-title-row">
              <h1>{venue.name}</h1>
              <IonChip color="primary" className="category-chip">
                {venue.category.replace('_', ' ')}
              </IonChip>
            </div>

            <div className="venue-meta">
              <div className="rating-badge">
                <IonIcon icon={star} color="warning" />
                <span className="rating-value">{venue.rating}</span>
                <span className="reviews-count">({venue.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="venue-location">
              <IonIcon icon={locationOutline} />
              <span>{venue.location.address}</span>
            </div>
          </div>

          {/* Quick Info */}
          <IonCard className="info-card">
            <IonCardContent>
              <div className="info-grid">
                <div className="info-item">
                  <IonIcon icon={peopleOutline} color="primary" />
                  <div>
                    <div className="info-label">Capacity</div>
                    <div className="info-value">{venue.capacity.min} - {venue.capacity.max} guests</div>
                  </div>
                </div>

                <div className="info-item">
                  <IonIcon icon={cashOutline} color="primary" />
                  <div>
                    <div className="info-label">Price Range</div>
                    <div className="info-value">
                      ₱{venue.priceRange.min.toLocaleString()} - ₱{venue.priceRange.max.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <IonIcon icon={timeOutline} color="primary" />
                  <div>
                    <div className="info-label">Operating Hours</div>
                    <div className="info-value">{venue.operatingHours}</div>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Description */}
          <div className="section">
            <h2 className="section-title">About This Venue</h2>
            <p className="description">{venue.description}</p>
          </div>

          {/* Amenities */}
          <div className="section">
            <h2 className="section-title">Amenities</h2>
            <div className="amenities-grid">
              {venue.amenities.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <IonIcon icon={checkmarkCircle} color="success" />
                  <span>{getAmenityLabel(amenity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* House Rules */}
          <div className="section">
            <h2 className="section-title">House Rules</h2>
            <p className="house-rules">{venue.houseRules}</p>
          </div>

          {/* Reviews */}
          <div className="section">
            <h2 className="section-title">Reviews ({reviews.length})</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <IonCard key={review.id} className="review-card">
                    <IonCardContent>
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.customerName.charAt(0)}
                          </div>
                          <div>
                            <div className="reviewer-name">{review.customerName}</div>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="review-rating">
                          <IonIcon icon={star} color="warning" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="review-text">{review.reviewText}</p>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Floating Book Now Button */}
        <div className="booking-footer">
          <div className="footer-content">
            <div className="price-info">
              <span className="price-label">Starting from</span>
              <span className="price-value">₱{venue.priceRange.min.toLocaleString()}</span>
            </div>
            <IonButton
              expand="block"
              className="book-button"
              onClick={handleBookNow}
            >
              Book Now
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VenueDetails;
