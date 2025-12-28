import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonBackButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  useIonRouter,
  useIonToast,
  useIonAlert,
} from '@ionic/react';
import {
  addCircleOutline,
  createOutline,
  trashOutline,
  closeCircle,
  addOutline,
  logOutOutline,
} from 'ionicons/icons';
import { ServicePackage } from '../../types/venue.types';
import { servicePackageService } from '../../services/servicePackageService';
import { venueService } from '../../services/venueService';
import { authService } from '../../services/authService';

import './ServicePackages.css';

interface RouteParams {
  id: string;
}

const ServicePackages: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const params = useParams<RouteParams>();

  const [venueName, setVenueName] = useState('');
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [newInclusion, setNewInclusion] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'catering' as 'catering' | 'decoration' | 'photography' | 'entertainment' | 'other',
    description: '',
    pricingUnit: 'flat_rate' as 'flat_rate' | 'per_person' | 'per_hour',
    price: 0,
    pricePerPerson: 0,
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = () => {
    const venue = venueService.getVenueById(params.id);
    if (venue) {
      setVenueName(venue.name);
    }

    const pkgs = servicePackageService.getVenuePackages(params.id);
    setPackages(pkgs);
  };

  const handleRefresh = (event: CustomEvent) => {
    loadData();
    setTimeout(() => {
      event.detail.complete();
    }, 500);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'catering',
      description: '',
      pricingUnit: 'flat_rate',
      price: 0,
      pricePerPerson: 0,
    });
    setInclusions([]);
    setEditingPackage(null);
  };

  const handleAddPackage = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      type: pkg.type,
      description: pkg.description,
      pricingUnit: pkg.pricingUnit || 'flat_rate',
      price: pkg.price || 0,
      pricePerPerson: pkg.pricePerPerson || 0,
    });
    setInclusions(pkg.inclusions || []);
    setShowModal(true);
  };

  const handleDeletePackage = (pkg: ServicePackage) => {
    const checkResult = servicePackageService.canDeletePackage(pkg.id);

    if (!checkResult.canDelete) {
      presentAlert({
        header: 'Cannot Delete Package',
        message: checkResult.reason,
        buttons: ['OK'],
      });
      return;
    }

    presentAlert({
      header: 'Delete Package',
      message: `Are you sure you want to delete "${pkg.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            const success = servicePackageService.deletePackage(pkg.id);
            if (success) {
              present({
                message: 'Package deleted successfully!',
                duration: 2000,
                color: 'success',
              });
              loadData();
            }
          },
        },
      ],
    });
  };

  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      setInclusions([...inclusions, newInclusion.trim()]);
      setNewInclusion('');
    }
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusions(inclusions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      present({ message: 'Package name is required', duration: 2000, color: 'warning' });
      return;
    }
    if (!formData.description.trim()) {
      present({ message: 'Description is required', duration: 2000, color: 'warning' });
      return;
    }

    const packageData: Omit<ServicePackage, 'id'> = {
      venueId: params.id,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      pricingUnit: formData.pricingUnit,
      inclusions,
    };

    if (formData.pricingUnit === 'per_person') {
      packageData.pricePerPerson = formData.pricePerPerson;
    } else {
      packageData.price = formData.price;
    }

    if (editingPackage) {
      const updated = servicePackageService.updatePackage(editingPackage.id, packageData);
      if (updated) {
        present({
          message: 'Package updated successfully!',
          duration: 2000,
          color: 'success',
        });
        loadData();
        setShowModal(false);
        resetForm();
      }
    } else {
      servicePackageService.createPackage(packageData);
      present({
        message: 'Package created successfully!',
        duration: 2000,
        color: 'success',
      });
      loadData();
      setShowModal(false);
      resetForm();
    }
  };

  const groupedPackages = packages.reduce((acc, pkg) => {
    if (!acc[pkg.type]) {
      acc[pkg.type] = [];
    }
    acc[pkg.type].push(pkg);
    return acc;
  }, {} as Record<string, ServicePackage[]>);

  const packageTypes = [
    { key: 'catering', label: 'Catering' },
    { key: 'decoration', label: 'Decoration' },
    { key: 'photography', label: 'Photography' },
    { key: 'entertainment', label: 'Entertainment' },
    { key: 'other', label: 'Other' },
  ];

  const formatPrice = (pkg: ServicePackage) => {
    if (pkg.pricingUnit === 'per_person') {
      return `₱${pkg.pricePerPerson?.toLocaleString()} per person`;
    } else if (pkg.pricingUnit === 'per_hour') {
      return `₱${pkg.price?.toLocaleString()} per hour`;
    } else {
      return `₱${pkg.price?.toLocaleString()} flat rate`;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/owner/venues/edit/${params.id}`} />
          </IonButtons>
          <IonTitle>Service Packages</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="service-packages-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="packages-container">
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
          </div>

          <div className="venue-header">
            <h1>{venueName}</h1>
            <IonButton onClick={handleAddPackage}>
              <IonIcon icon={addCircleOutline} slot="start" />
              Add Package
            </IonButton>
          </div>

          {packages.length > 0 ? (
            <div className="packages-list">
              {packageTypes.map(({ key, label }) => {
                const typePackages = groupedPackages[key] || [];
                if (typePackages.length === 0) return null;

                return (
                  <div key={key} className="package-group">
                    <h2 className="group-title">
                      {label} ({typePackages.length})
                    </h2>
                    {typePackages.map(pkg => (
                      <IonCard key={pkg.id} className="package-card">
                        <IonCardHeader>
                          <div className="card-header-content">
                            <IonCardTitle>{pkg.name}</IonCardTitle>
                            <div className="package-actions">
                              <IonButton
                                size="small"
                                fill="clear"
                                onClick={() => handleEditPackage(pkg)}
                              >
                                <IonIcon icon={createOutline} />
                              </IonButton>
                              <IonButton
                                size="small"
                                fill="clear"
                                color="danger"
                                onClick={() => handleDeletePackage(pkg)}
                              >
                                <IonIcon icon={trashOutline} />
                              </IonButton>
                            </div>
                          </div>
                        </IonCardHeader>
                        <IonCardContent>
                          <p className="package-description">{pkg.description}</p>
                          <div className="package-price">{formatPrice(pkg)}</div>
                          {pkg.inclusions && pkg.inclusions.length > 0 && (
                            <div className="package-inclusions">
                              <strong>Inclusions:</strong>
                              <ul>
                                {pkg.inclusions.map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </IonCardContent>
                      </IonCard>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <IonIcon icon={addCircleOutline} className="empty-icon" />
              <h2>No service packages yet</h2>
              <p>Add service packages to offer additional services to your customers</p>
              <IonButton onClick={handleAddPackage}>
                <IonIcon icon={addCircleOutline} slot="start" />
                Add Package
              </IonButton>
            </div>
          )}
        </div>

        {/* Add/Edit Package Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>{editingPackage ? 'Edit Package' : 'Add Package'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  <IonIcon icon={closeCircle} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="modal-content">
            <div className="modal-form">
              <IonItem>
                <IonLabel position="stacked">Package Name *</IonLabel>
                <IonInput
                  value={formData.name}
                  onIonInput={e => setFormData({ ...formData, name: e.detail.value! })}
                  placeholder="e.g., Premium Catering Package"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Type *</IonLabel>
                <IonSelect
                  value={formData.type}
                  onIonChange={e => setFormData({ ...formData, type: e.detail.value })}
                >
                  <IonSelectOption value="catering">Catering</IonSelectOption>
                  <IonSelectOption value="decoration">Decoration</IonSelectOption>
                  <IonSelectOption value="photography">Photography</IonSelectOption>
                  <IonSelectOption value="entertainment">Entertainment</IonSelectOption>
                  <IonSelectOption value="other">Other</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Description *</IonLabel>
                <IonTextarea
                  value={formData.description}
                  onIonInput={e => setFormData({ ...formData, description: e.detail.value! })}
                  placeholder="Describe the package..."
                  rows={3}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Pricing Unit *</IonLabel>
                <IonSelect
                  value={formData.pricingUnit}
                  onIonChange={e => setFormData({ ...formData, pricingUnit: e.detail.value })}
                >
                  <IonSelectOption value="flat_rate">Flat Rate</IonSelectOption>
                  <IonSelectOption value="per_person">Per Person</IonSelectOption>
                  <IonSelectOption value="per_hour">Per Hour</IonSelectOption>
                </IonSelect>
              </IonItem>

              {formData.pricingUnit === 'per_person' ? (
                <IonItem>
                  <IonLabel position="stacked">Price Per Person (₱) *</IonLabel>
                  <IonInput
                    type="number"
                    value={formData.pricePerPerson}
                    onIonInput={e =>
                      setFormData({ ...formData, pricePerPerson: parseInt(e.detail.value! || '0') })
                    }
                  />
                </IonItem>
              ) : (
                <IonItem>
                  <IonLabel position="stacked">Price (₱) *</IonLabel>
                  <IonInput
                    type="number"
                    value={formData.price}
                    onIonInput={e => setFormData({ ...formData, price: parseInt(e.detail.value! || '0') })}
                  />
                </IonItem>
              )}

              <div className="inclusions-section">
                <h3>Inclusions</h3>
                <div className="add-inclusion">
                  <IonInput
                    value={newInclusion}
                    onIonInput={e => setNewInclusion(e.detail.value!)}
                    placeholder="e.g., 5 Main Dishes"
                    onKeyPress={e => e.key === 'Enter' && handleAddInclusion()}
                  />
                  <IonButton onClick={handleAddInclusion} fill="outline">
                    <IonIcon icon={addOutline} />
                  </IonButton>
                </div>

                {inclusions.length > 0 && (
                  <IonList className="inclusions-list">
                    {inclusions.map((item, index) => (
                      <IonItem key={index}>
                        <IonLabel>{item}</IonLabel>
                        <IonButton
                          slot="end"
                          size="small"
                          fill="clear"
                          color="danger"
                          onClick={() => handleRemoveInclusion(index)}
                        >
                          <IonIcon icon={closeCircle} />
                        </IonButton>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </div>

              <div className="modal-actions">
                <IonButton expand="block" onClick={handleSubmit}>
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ServicePackages;
