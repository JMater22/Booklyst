import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  useIonRouter,
  useIonToast,
  IonBackButton,
  IonButtons,
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, callOutline, briefcaseOutline } from 'ionicons/icons';
import { authService } from '../../services/authService';
import './Register.css';

const Register: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !phone || !password) {
      present({
        message: 'Please fill in all fields',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    if (password !== confirmPassword) {
      present({
        message: 'Passwords do not match',
        duration: 2000,
        color: 'danger',
      });
      return;
    }

    if (password.length < 6) {
      present({
        message: 'Password must be at least 6 characters',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = authService.register({
        name,
        email,
        phone,
        password,
        role,
        profilePic: null,
      });

      present({
        message: 'Account created successfully!',
        duration: 2000,
        color: 'success',
      });

      // Navigate to appropriate home
      if (role === 'customer') {
        router.push('/home', 'root');
      } else {
        router.push('/owner/dashboard', 'root');
      }

      setLoading(false);
    }, 500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="register-content" fullscreen>
        <div className="register-container">
          <div className="register-header">
            <h1>Join Booklyst</h1>
            <p className="text-secondary">Start planning your perfect event</p>
          </div>

          <div className="register-form">
            <IonItem lines="none" className="input-item">
              <IonIcon icon={personOutline} slot="start" color="medium" />
              <IonInput
                type="text"
                placeholder="Full Name"
                value={name}
                onIonInput={(e) => setName(e.detail.value!)}
                clearInput
              />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonIcon icon={mailOutline} slot="start" color="medium" />
              <IonInput
                type="email"
                placeholder="Email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                clearInput
              />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonIcon icon={callOutline} slot="start" color="medium" />
              <IonInput
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onIonInput={(e) => setPhone(e.detail.value!)}
                clearInput
              />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonIcon icon={briefcaseOutline} slot="start" color="medium" />
              <IonLabel>I am a</IonLabel>
              <IonSelect value={role} onIonChange={(e) => setRole(e.detail.value)}>
                <IonSelectOption value="customer">Customer (Planning an event)</IonSelectOption>
                <IonSelectOption value="owner">Venue Owner</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                clearInput
              />
            </IonItem>

            <IonItem lines="none" className="input-item">
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                clearInput
              />
            </IonItem>

            <IonButton
              expand="block"
              className="register-button"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </IonButton>

            <div className="login-link">
              <span className="text-secondary">Already have an account? </span>
              <IonButton fill="clear" size="small" routerLink="/login" color="primary">
                Sign In
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
