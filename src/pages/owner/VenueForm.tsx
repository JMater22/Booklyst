import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonCheckbox,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { authService } from '../../services/authService';
import { venueService } from '../../services/venueService';
import { storageService } from '../../services/storageService';

import './VenueForm.css';

const VenueForm: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'events_hall',
    address: '',
    city: 'Tarlac City',
    province: 'Tarlac',
    minCapacity: 50,
    maxCapacity: 200,
    minPrice: 20000,
    maxPrice: 50000,
    description: '',
    operatingHours: '8:00 AM - 10:00 PM',
    houseRules: '',
    amenities: [] as string[],
  });

  const availableAmenities = [
    { id: 'wifi', label: 'WiFi' },
    { id: 'parking', label: 'Parking' },
    { id: 'ac', label: 'Air Conditioning' },
    { id: 'sound_system', label: 'Sound System' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'stage', label: 'Stage' },
    { id: 'projector', label: 'Projector' },
    { id: 'led_lights', label: 'LED Lights' },
    { id: 'outdoor_space', label: 'Outdoor Space' },
    { id: 'restrooms', label: 'Restrooms' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      present({ message: 'Venue name is required', duration: 2000, color: 'warning' });
      return false;
    }
    if (!formData.address.trim()) {
      present({ message: 'Address is required', duration: 2000, color: 'warning' });
      return false;
    }
    if (!formData.description.trim()) {
      present({ message: 'Description is required', duration: 2000, color: 'warning' });
      return false;
    }
    if (formData.minCapacity >= formData.maxCapacity) {
      present({ message: 'Max capacity must be greater than min capacity', duration: 2000, color: 'warning' });
      return false;
    }
    if (formData.minPrice >= formData.maxPrice) {
      present({ message: 'Max price must be greater than min price', duration: 2000, color: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const user = authService.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const newVenue = {
      id: `venue_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      location: {
        address: formData.address,
        city: formData.city,
        province: formData.province,
      },
      capacity: {
        min: formData.minCapacity,
        max: formData.maxCapacity,
      },
      priceRange: {
        min: formData.minPrice,
        max: formData.maxPrice,
      },
      description: formData.description,
      operatingHours: formData.operatingHours,
      houseRules: formData.houseRules || 'Please follow venue guidelines',
      amenities: formData.amenities,
      images: [
        'https://picsum.photos/800/600?random=' + Date.now(),
      ],
      coverImage: 'https://picsum.photos/800/600?random=' + Date.now(),
      rating: 0,
      totalReviews: 0,
      isFeatured: false,
      ownerId: user.id,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const userVenues = storageService.get('userVenues') || [];
    userVenues.push(newVenue);
    storageService.set('userVenues', userVenues);

    present({
      message: 'Venue created successfully!',
      duration: 2000,
      color: 'success',
    });

    router.push('/owner/dashboard', 'back');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/owner/dashboard" />
          </IonButtons>
          <IonTitle>Add New Venue</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="venue-form-content">
        <div className="venue-form-container">
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>

            <IonItem>
              <IonLabel position="stacked">Venue Name *</IonLabel>
              <IonInput
                value={formData.name}
                onIonInput={e => handleInputChange('name', e.detail.value)}
                placeholder="e.g., The Grand Plaza"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Category *</IonLabel>
              <IonSelect
                value={formData.category}
                onIonChange={e => handleInputChange('category', e.detail.value)}
              >
                <IonSelectOption value="ballroom">Ballroom</IonSelectOption>
                <IonSelectOption value="garden">Garden</IonSelectOption>
                <IonSelectOption value="conference">Conference Room</IonSelectOption>
                <IonSelectOption value="restaurant">Restaurant</IonSelectOption>
                <IonSelectOption value="events_hall">Events Hall</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Description *</IonLabel>
              <IonTextarea
                value={formData.description}
                onIonInput={e => handleInputChange('description', e.detail.value)}
                placeholder="Describe your venue..."
                rows={4}
              />
            </IonItem>
          </div>

          <div className="form-section">
            <h2 className="section-title">Location</h2>

            <IonItem>
              <IonLabel position="stacked">Address *</IonLabel>
              <IonInput
                value={formData.address}
                onIonInput={e => handleInputChange('address', e.detail.value)}
                placeholder="Street address"
              />
            </IonItem>

            <div className="form-row">
              <IonItem>
                <IonLabel position="stacked">City *</IonLabel>
                <IonInput
                  value={formData.city}
                  onIonInput={e => handleInputChange('city', e.detail.value)}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Province *</IonLabel>
                <IonInput
                  value={formData.province}
                  onIonInput={e => handleInputChange('province', e.detail.value)}
                />
              </IonItem>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Capacity</h2>

            <div className="form-row">
              <IonItem>
                <IonLabel position="stacked">Min Capacity *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.minCapacity}
                  onIonInput={e => handleInputChange('minCapacity', parseInt(e.detail.value || '0'))}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Max Capacity *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.maxCapacity}
                  onIonInput={e => handleInputChange('maxCapacity', parseInt(e.detail.value || '0'))}
                />
              </IonItem>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Pricing (₱)</h2>

            <div className="form-row">
              <IonItem>
                <IonLabel position="stacked">Min Price *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.minPrice}
                  onIonInput={e => handleInputChange('minPrice', parseInt(e.detail.value || '0'))}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Max Price *</IonLabel>
                <IonInput
                  type="number"
                  value={formData.maxPrice}
                  onIonInput={e => handleInputChange('maxPrice', parseInt(e.detail.value || '0'))}
                />
              </IonItem>
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Amenities</h2>
            <div className="amenities-checkboxes">
              {availableAmenities.map(amenity => (
                <IonItem key={amenity.id} lines="none">
                  <IonCheckbox
                    slot="start"
                    checked={formData.amenities.includes(amenity.id)}
                    onIonChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <IonLabel>{amenity.label}</IonLabel>
                </IonItem>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Additional Details</h2>

            <IonItem>
              <IonLabel position="stacked">Operating Hours</IonLabel>
              <IonInput
                value={formData.operatingHours}
                onIonInput={e => handleInputChange('operatingHours', e.detail.value)}
                placeholder="e.g., 8:00 AM - 10:00 PM"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">House Rules</IonLabel>
              <IonTextarea
                value={formData.houseRules}
                onIonInput={e => handleInputChange('houseRules', e.detail.value)}
                placeholder="Any rules or guidelines for guests..."
                rows={3}
              />
            </IonItem>
          </div>

          <div className="form-actions">
            <IonButton
              expand="block"
              onClick={handleSubmit}
              className="submit-button"
            >
              Create Venue
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VenueForm;
