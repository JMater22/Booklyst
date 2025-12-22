import React, { useState, useEffect } from 'react';
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
  IonDatetime,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonButtons,
  IonBackButton,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { checkmarkCircle, card, logoGooglePlaystore } from 'ionicons/icons';
import { Venue, ServicePackage } from '../../types/venue.types';
import { venueService } from '../../services/venueService';
import { bookingService } from '../../services/bookingService';
import { authService } from '../../services/authService';
import mockServicePackages from '../../data/mockServicePackages.json';

import './BookingFlow.css';

interface BookingFormData {
  eventName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  specialRequests: string;
  selectedServices: string[];
}

const BookingFlow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useIonRouter();
  const [present] = useIonToast();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    eventName: '',
    eventType: 'birthday',
    eventDate: '',
    startTime: '14:00',
    endTime: '22:00',
    guestCount: 50,
    specialRequests: '',
    selectedServices: [],
  });

  const [availableServices, setAvailableServices] = useState<ServicePackage[]>([]);

  useEffect(() => {
    loadVenueData();
  }, [id]);

  const loadVenueData = () => {
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

    // Load services for this venue
    const services = (mockServicePackages as ServicePackage[]).filter(
      pkg => pkg.venueId === id
    );
    setAvailableServices(services);
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const calculatePricing = () => {
    if (!venue) return { subtotal: 0, serviceFee: 0, total: 0, deposit: 0, balance: 0 };

    let venuePrice = venue.priceRange.min;
    const selectedServicesList = availableServices.filter(s =>
      formData.selectedServices.includes(s.id)
    );

    const servicesPricing = selectedServicesList.map(service => {
      if (service.pricingUnit === 'per_person' && service.pricePerPerson) {
        return {
          name: service.name,
          price: service.pricePerPerson * formData.guestCount,
        };
      } else {
        return {
          name: service.name,
          price: service.price || 0,
        };
      }
    });

    return {
      ...bookingService.calculateTotal(
        venuePrice,
        servicesPricing
      ),
      venuePrice,
      servicesPricing,
    };
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.eventName || !formData.eventDate || !formData.startTime || !formData.endTime) {
          present({
            message: 'Please fill in all required fields',
            duration: 2000,
            color: 'warning',
          });
          return false;
        }
        if (formData.guestCount < 1) {
          present({
            message: 'Guest count must be at least 1',
            duration: 2000,
            color: 'warning',
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);

    const user = authService.getCurrentUser();
    if (!user) {
      present({
        message: 'Please login to continue',
        duration: 2000,
        color: 'danger',
      });
      router.push('/login');
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      const pricing = calculatePricing();

      const booking = bookingService.createBooking({
        customerId: user.id,
        venueId: id,
        eventName: formData.eventName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        guestCount: formData.guestCount,
        services: formData.selectedServices,
        specialRequests: formData.specialRequests,
        totalAmount: pricing.total,
        depositAmount: pricing.deposit,
        balanceAmount: pricing.balance,
        status: 'confirmed',
        paymentStatus: 'deposit_paid',
      });

      setLoading(false);
      setCurrentStep(5); // Show confirmation

      present({
        message: 'Booking confirmed successfully!',
        duration: 2000,
        color: 'success',
      });
    }, 2000);
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3, 4].map(step => (
        <div
          key={step}
          className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
        >
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 && 'Details'}
            {step === 2 && 'Services'}
            {step === 3 && 'Review'}
            {step === 4 && 'Payment'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="step-content">
      <h2 className="step-title">Event Details</h2>

      <IonItem>
        <IonLabel position="stacked">Event Name *</IonLabel>
        <IonInput
          value={formData.eventName}
          onIonInput={e => handleInputChange('eventName', e.detail.value)}
          placeholder="e.g., Birthday Celebration"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Event Type *</IonLabel>
        <IonSelect
          value={formData.eventType}
          onIonChange={e => handleInputChange('eventType', e.detail.value)}
        >
          <IonSelectOption value="birthday">Birthday</IonSelectOption>
          <IonSelectOption value="wedding">Wedding</IonSelectOption>
          <IonSelectOption value="corporate">Corporate Event</IonSelectOption>
          <IonSelectOption value="anniversary">Anniversary</IonSelectOption>
          <IonSelectOption value="seminar">Seminar/Workshop</IonSelectOption>
          <IonSelectOption value="other">Other</IonSelectOption>
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Event Date *</IonLabel>
        <IonDatetime
          value={formData.eventDate}
          onIonChange={e => handleInputChange('eventDate', e.detail.value)}
          presentation="date"
          min={new Date().toISOString()}
        />
      </IonItem>

      <div className="time-row">
        <IonItem>
          <IonLabel position="stacked">Start Time *</IonLabel>
          <IonDatetime
            value={formData.startTime}
            onIonChange={e => handleInputChange('startTime', e.detail.value)}
            presentation="time"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">End Time *</IonLabel>
          <IonDatetime
            value={formData.endTime}
            onIonChange={e => handleInputChange('endTime', e.detail.value)}
            presentation="time"
          />
        </IonItem>
      </div>

      <IonItem>
        <IonLabel position="stacked">Number of Guests *</IonLabel>
        <IonInput
          type="number"
          value={formData.guestCount}
          onIonInput={e => handleInputChange('guestCount', parseInt(e.detail.value || '0'))}
          min="1"
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Special Requests (Optional)</IonLabel>
        <IonTextarea
          value={formData.specialRequests}
          onIonInput={e => handleInputChange('specialRequests', e.detail.value)}
          placeholder="Any special requirements or requests..."
          rows={4}
        />
      </IonItem>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2 className="step-title">Add Services (Optional)</h2>
      <p className="step-description">Enhance your event with additional services</p>

      {availableServices.length > 0 ? (
        <div className="services-list">
          {availableServices.map(service => (
            <IonCard key={service.id} className="service-card">
              <IonCardContent>
                <div className="service-header">
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <p className="service-description">{service.description}</p>
                    <div className="service-price">
                      {service.pricingUnit === 'per_person' ? (
                        <>₱{service.pricePerPerson?.toLocaleString()} per person</>
                      ) : (
                        <>₱{service.price?.toLocaleString()}</>
                      )}
                    </div>
                    {service.inclusions && (
                      <ul className="service-inclusions">
                        {service.inclusions.map((item, idx) => (
                          <li key={idx}>
                            <IonIcon icon={checkmarkCircle} color="success" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <IonCheckbox
                    checked={formData.selectedServices.includes(service.id)}
                    onIonChange={() => handleServiceToggle(service.id)}
                  />
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      ) : (
        <p className="no-services">No additional services available for this venue.</p>
      )}
    </div>
  );

  const renderStep3 = () => {
    const pricing = calculatePricing();

    return (
      <div className="step-content">
        <h2 className="step-title">Review & Confirm</h2>

        <IonCard className="review-card">
          <IonCardContent>
            <h3>Event Details</h3>
            <div className="review-item">
              <span className="label">Event Name:</span>
              <span className="value">{formData.eventName}</span>
            </div>
            <div className="review-item">
              <span className="label">Event Type:</span>
              <span className="value">{formData.eventType}</span>
            </div>
            <div className="review-item">
              <span className="label">Date:</span>
              <span className="value">{new Date(formData.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="review-item">
              <span className="label">Time:</span>
              <span className="value">{formData.startTime} - {formData.endTime}</span>
            </div>
            <div className="review-item">
              <span className="label">Guests:</span>
              <span className="value">{formData.guestCount}</span>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard className="pricing-card">
          <IonCardContent>
            <h3>Pricing Breakdown</h3>
            <div className="pricing-item">
              <span>Venue Rental:</span>
              <span>₱{pricing.venuePrice?.toLocaleString()}</span>
            </div>
            {pricing.servicesPricing?.map((service: any, idx: number) => (
              <div key={idx} className="pricing-item">
                <span>{service.name}:</span>
                <span>₱{service.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="pricing-divider" />
            <div className="pricing-item">
              <span>Subtotal:</span>
              <span>₱{pricing.subtotal.toLocaleString()}</span>
            </div>
            <div className="pricing-item">
              <span>Service Fee (5%):</span>
              <span>₱{pricing.serviceFee.toLocaleString()}</span>
            </div>
            <div className="pricing-divider" />
            <div className="pricing-item total">
              <span>TOTAL:</span>
              <span>₱{pricing.total.toLocaleString()}</span>
            </div>
            <div className="pricing-divider" />
            <div className="pricing-item deposit">
              <span>Deposit Required (30%):</span>
              <span>₱{pricing.deposit.toLocaleString()}</span>
            </div>
            <div className="pricing-item">
              <span>Balance Due:</span>
              <span>₱{pricing.balance.toLocaleString()}</span>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="step-content">
      <h2 className="step-title">Payment</h2>
      <p className="step-description">Choose your payment method</p>

      <div className="payment-methods">
        <IonCard className="payment-method-card">
          <IonCardContent>
            <div className="payment-method">
              <IonIcon icon={logoGooglePlaystore} color="primary" className="payment-icon" />
              <div>
                <h3>GCash</h3>
                <p>Pay securely via GCash</p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard className="payment-method-card">
          <IonCardContent>
            <div className="payment-method">
              <IonIcon icon={card} color="primary" className="payment-icon" />
              <div>
                <h3>Credit/Debit Card</h3>
                <p>Visa, Mastercard, AmEx</p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </div>

      <div className="payment-note">
        <p><strong>Note:</strong> This is a mock payment. In production, this would integrate with PayMongo or other payment gateways.</p>
      </div>

      <IonButton
        expand="block"
        className="payment-button"
        onClick={handleSubmitBooking}
        disabled={loading}
      >
        {loading ? 'Processing Payment...' : `Pay Deposit ₱${calculatePricing().deposit.toLocaleString()}`}
      </IonButton>
    </div>
  );

  const renderStep5 = () => (
    <div className="step-content confirmation">
      <div className="confirmation-icon">
        <IonIcon icon={checkmarkCircle} color="success" />
      </div>
      <h2 className="confirmation-title">Booking Confirmed!</h2>
      <p className="confirmation-message">
        Your booking has been confirmed. You will receive a confirmation email shortly.
      </p>

      <IonButton
        expand="block"
        routerLink="/bookings"
        className="view-bookings-button"
      >
        View My Bookings
      </IonButton>

      <IonButton
        expand="block"
        fill="outline"
        routerLink="/home"
        className="back-home-button"
      >
        Back to Home
      </IonButton>
    </div>
  );

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
          {currentStep < 5 && (
            <IonButtons slot="start">
              <IonBackButton defaultHref={`/venue/${id}`} />
            </IonButtons>
          )}
          <IonTitle>Book {venue.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="booking-content">
        {currentStep < 5 && renderStepIndicator()}

        <div className="booking-container">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {currentStep < 4 && (
          <div className="navigation-buttons">
            {currentStep > 1 && (
              <IonButton
                expand="block"
                fill="outline"
                onClick={handleBack}
                className="back-button"
              >
                Back
              </IonButton>
            )}
            <IonButton
              expand="block"
              onClick={handleNext}
              className="next-button"
            >
              {currentStep === 3 ? 'Proceed to Payment' : 'Next'}
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BookingFlow;
