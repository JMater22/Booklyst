import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  IonIcon,
  IonChip,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import {
  imagesOutline,
  closeCircle,
  checkmarkCircle,
  briefcaseOutline,
  logOutOutline,
} from 'ionicons/icons';
import { authService } from '../../services/authService';
import { venueService } from '../../services/venueService';
import { storageService } from '../../services/storageService';

import './VenueForm.css';

interface RouteParams {
  id?: string;
}

const VenueForm: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const params = useParams<RouteParams>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isEditMode = !!params.id;
  const venueId = params.id || null;
  const [images, setImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    category: 'events_hall' as 'events_hall' | 'restaurant' | 'ballroom' | 'garden' | 'conference' | 'wedding_hall',
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

  useEffect(() => {
    if (isEditMode && params.id) {
      loadVenueData(params.id);
    }
  }, [isEditMode, params.id]);

  const loadVenueData = (id: string) => {
    const venue = venueService.getVenueById(id);

    if (!venue) {
      present({
        message: 'Venue not found',
        duration: 2000,
        color: 'danger',
      });
      router.push('/owner/venues');
      return;
    }

    setFormData({
      name: venue.name,
      category: venue.category,
      address: venue.location.address,
      city: venue.location.city,
      province: venue.location.province,
      minCapacity: venue.capacity.min,
      maxCapacity: venue.capacity.max,
      minPrice: venue.priceRange.min,
      maxPrice: venue.priceRange.max,
      description: venue.description,
      operatingHours: venue.operatingHours || '8:00 AM - 10:00 PM',
      houseRules: venue.houseRules || '',
      amenities: venue.amenities || [],
    });

    setImages(venue.images || []);
    const coverIndex = venue.images?.indexOf(venue.coverImage) || 0;
    setCoverImageIndex(coverIndex >= 0 ? coverIndex : 0);
  };

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const files = input.files;

    if (!files) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const maxImages = 5;

    if (images.length + files.length > maxImages) {
      present({
        message: `Maximum ${maxImages} images allowed`,
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        present({
          message: `Image ${file.name} exceeds 2MB limit`,
          duration: 2000,
          color: 'warning',
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        present({
          message: `${file.name} is not a valid image file`,
          duration: 2000,
          color: 'warning',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    input.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Adjust cover image index if needed
      if (coverImageIndex === index) {
        setCoverImageIndex(0);
      } else if (coverImageIndex > index) {
        setCoverImageIndex(coverImageIndex - 1);
      }
      return newImages;
    });
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
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
    if (images.length === 0) {
      present({ message: 'At least one image is required', duration: 2000, color: 'warning' });
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

    const venueData = {
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
      images: images,
      coverImage: images[coverImageIndex],
    };

    if (isEditMode && venueId) {
      // Update existing venue
      const updatedVenue = venueService.updateVenue(venueId, venueData);

      if (updatedVenue) {
        present({
          message: 'Venue updated successfully!',
          duration: 2000,
          color: 'success',
        });
        router.push('/owner/venues', 'back');
      } else {
        present({
          message: 'Failed to update venue',
          duration: 2000,
          color: 'danger',
        });
      }
    } else {
      // Create new venue
      const newVenue = {
        id: `venue_${Date.now()}`,
        ...venueData,
        rating: 0,
        totalReviews: 0,
        isFeatured: false,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
      };

      const userVenues = storageService.get<any[]>('userVenues') || [];
      userVenues.push(newVenue);
      storageService.set('userVenues', userVenues);

      present({
        message: 'Venue created successfully!',
        duration: 2000,
        color: 'success',
      });

      router.push('/owner/dashboard', 'back');
    }
  };

  const handleManagePackages = () => {
    if (venueId) {
      router.push(`/owner/venues/${venueId}/packages`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref={isEditMode ? '/owner/venues' : '/owner/dashboard'} />
          </IonButtons>
          <IonTitle>{isEditMode ? 'Edit Venue' : 'Add New Venue'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="venue-form-content">
        <div className="venue-form-container">
          <div style={{ display: 'flex', gap: '12px', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            {isEditMode && (
              <IonButton expand="block" onClick={() => router.push(`/owner/venues/${params.id}/packages`)}>
                Manage Packages
              </IonButton>
            )}
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
          </div>
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
            <h2 className="section-title">Venue Images (Max 5) *</h2>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            <IonButton
              expand="block"
              fill="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <IonIcon icon={imagesOutline} slot="start" />
              Upload Images {images.length > 0 && `(${images.length}/5)`}
            </IonButton>

            {images.length > 0 && (
              <div className="image-previews">
                {images.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <IonButton
                      size="small"
                      color="danger"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      <IonIcon icon={closeCircle} />
                    </IonButton>
                    <div className="cover-image-selector">
                      {coverImageIndex === index ? (
                        <IonChip color="primary">
                          <IonIcon icon={checkmarkCircle} />
                          <IonLabel>Cover</IonLabel>
                        </IonChip>
                      ) : (
                        <IonButton
                          size="small"
                          fill="outline"
                          onClick={() => setCoverImageIndex(index)}
                        >
                          Set as Cover
                        </IonButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <p className="image-hint">
                Upload at least one image. The first image will be used as the cover photo.
              </p>
            )}
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
              {isEditMode ? 'Update Venue' : 'Create Venue'}
            </IonButton>

            {isEditMode && (
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleManagePackages}
                className="packages-button"
              >
                <IonIcon icon={briefcaseOutline} slot="start" />
                Manage Service Packages
              </IonButton>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VenueForm;
