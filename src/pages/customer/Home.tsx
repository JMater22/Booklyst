import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonButton,
  IonButtons,
  useIonRouter,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import { personCircleOutline, logOutOutline, heartOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Venue } from '../../types/venue.types';
import { venueService } from '../../services/venueService';
import { authService } from '../../services/authService';
import VenueCard from '../../components/venue/VenueCard';
import TabBar from '../../components/navigation/TabBar';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './Home.css';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'ballroom', label: 'Ballroom' },
  { id: 'garden', label: 'Garden' },
  { id: 'conference', label: 'Conference' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'events_hall', label: 'Events Hall' },
];

const Home: React.FC = () => {
  const router = useIonRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    filterVenues();
  }, [searchQuery, selectedCategory, venues]);

  const loadVenues = () => {
    const allVenues = venueService.getAllVenues();
    const featured = venueService.getFeaturedVenues();
    setVenues(allVenues);
    setFeaturedVenues(featured);
    setFilteredVenues(allVenues);
  };

  const filterVenues = () => {
    let filtered = venues;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = venueService.filterByCategory(selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.province.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVenues(filtered);
  };

  const handleVenueClick = (venueId: string) => {
    router.push(`/venue/${venueId}`);
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleFavoritesClick = () => {
    router.push('/favorites');
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const handleRefresh = (event: CustomEvent) => {
    loadVenues();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Discover Venues</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleFavoritesClick}>
              <IonIcon icon={heartOutline} />
            </IonButton>
            <IonButton onClick={handleProfileClick}>
              <IonIcon icon={personCircleOutline} />
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="home-container">
          {/* Search Bar */}
          <div className="home-search">
            <IonSearchbar
              value={searchQuery}
              onIonInput={(e) => setSearchQuery(e.detail.value!)}
              placeholder="Search venues or locations..."
              animated
              className="home-searchbar"
            />
          </div>

          {/* Category Filters */}
          <div className="home-categories">
            <div className="category-pills">
              {categories.map(category => (
                <IonChip
                  key={category.id}
                  color={selectedCategory === category.id ? 'primary' : 'medium'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  {category.label}
                </IonChip>
              ))}
            </div>
          </div>

          {/* Featured Venues Carousel */}
          {featuredVenues.length > 0 && (
            <div className="home-section">
              <div className="section-header">
                <h2>Featured Venues</h2>
              </div>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView={1.2}
                centeredSlides={false}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="featured-carousel"
              >
                {featuredVenues.map(venue => (
                  <SwiperSlide key={venue.id}>
                    <VenueCard
                      venue={venue}
                      onClick={() => handleVenueClick(venue.id)}
                      onFavoriteToggle={loadVenues}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* All Venues List */}
          <div className="home-section">
            <div className="section-header">
              <h2>
                {selectedCategory === 'all' ? 'All Venues' : `${categories.find(c => c.id === selectedCategory)?.label} Venues`}
              </h2>
              <span className="venue-count">{filteredVenues.length} venues</span>
            </div>

            <div className="venues-grid">
              {filteredVenues.length > 0 ? (
                filteredVenues.map(venue => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onClick={() => handleVenueClick(venue.id)}
                    onFavoriteToggle={loadVenues}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <p>No venues found</p>
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </IonButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Home;
