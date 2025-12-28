import React from 'react';
import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { homeOutline, calendarOutline, heartOutline, personOutline } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';

import './TabBar.css';

const TabBar: React.FC = () => {
  const location = useLocation();

  return (
    <IonTabBar slot="bottom" className="custom-tab-bar">
      <IonTabButton tab="home" href="/home" selected={location.pathname === '/home'}>
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>

      <IonTabButton tab="bookings" href="/bookings" selected={location.pathname === '/bookings'}>
        <IonIcon icon={calendarOutline} />
        <IonLabel>Bookings</IonLabel>
      </IonTabButton>

      <IonTabButton tab="favorites" href="/favorites" selected={location.pathname === '/favorites'}>
        <IonIcon icon={heartOutline} />
        <IonLabel>Favorites</IonLabel>
      </IonTabButton>

      <IonTabButton tab="profile" href="/profile" selected={location.pathname === '/profile'}>
        <IonIcon icon={personOutline} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar;
