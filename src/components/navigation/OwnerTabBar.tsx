import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { statsChartOutline, businessOutline } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

import './TabBar.css';

const OwnerTabBar: React.FC = () => {
  const location = useLocation();

  return (
    <IonTabBar slot="bottom" className="custom-tab-bar">
      <IonTabButton tab="dashboard" href="/owner/dashboard" selected={location.pathname === '/owner/dashboard'}>
        <IonIcon icon={statsChartOutline} />
        <IonLabel>Dashboard</IonLabel>
      </IonTabButton>

      <IonTabButton tab="venues" href="/owner/venues" selected={location.pathname === '/owner/venues' || location.pathname.startsWith('/owner/venues/')}>
        <IonIcon icon={businessOutline} />
        <IonLabel>My Venues</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default OwnerTabBar;
