import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAvatar,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import {
  personOutline,
  heartOutline,
  calendarOutline,
  settingsOutline,
  logOutOutline,
  notificationsOutline,
} from 'ionicons/icons';
import { authService } from '../../services/authService';
import './Profile.css';

const Profile: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    present({
      message: 'Logged out successfully',
      duration: 2000,
      color: 'success',
    });
    router.push('/login', 'root');
  };

  const handleMenuClick = (path: string) => {
    present({
      message: 'Coming soon!',
      duration: 1500,
      color: 'medium',
    });
  };

  if (!user) {
    router.push('/login', 'root');
    return null;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="profile-content" fullscreen>
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </IonAvatar>
            <h2>{user.name}</h2>
            <p className="text-secondary">{user.email}</p>
            <p className="text-secondary">{user.phone}</p>
            <IonButton
              fill="outline"
              size="small"
              className="edit-profile-btn"
              onClick={() => handleMenuClick('/profile/edit')}
            >
              Edit Profile
            </IonButton>
          </div>

          {/* Menu Items */}
          <IonList className="profile-menu">
            <IonItem button onClick={() => router.push('/bookings')}>
              <IonIcon icon={calendarOutline} slot="start" />
              <IonLabel>My Bookings</IonLabel>
            </IonItem>

            <IonItem button onClick={() => router.push('/favorites')}>
              <IonIcon icon={heartOutline} slot="start" />
              <IonLabel>Favorites</IonLabel>
            </IonItem>

            <IonItem button onClick={() => handleMenuClick('/notifications')}>
              <IonIcon icon={notificationsOutline} slot="start" />
              <IonLabel>Notifications</IonLabel>
            </IonItem>

            <IonItem button onClick={() => handleMenuClick('/settings')}>
              <IonIcon icon={settingsOutline} slot="start" />
              <IonLabel>Settings</IonLabel>
            </IonItem>
          </IonList>

          {/* Logout Button */}
          <div className="profile-logout">
            <IonButton
              expand="block"
              color="danger"
              fill="outline"
              onClick={handleLogout}
            >
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </div>

          {/* App Info */}
          <div className="profile-footer">
            <p className="text-secondary">Booklyst v1.0.0</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
