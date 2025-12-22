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
  IonCheckbox,
  IonText,
  IonIcon,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { authService } from '../../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const router = useIonRouter();
  const [present] = useIonToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      present({
        message: 'Please enter email and password',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = authService.login(email, password, rememberMe);

      if (user) {
        present({
          message: `Welcome back, ${user.name}!`,
          duration: 2000,
          color: 'success',
        });

        // Navigate based on role
        if (user.role === 'customer') {
          router.push('/home', 'root');
        } else if (user.role === 'owner') {
          router.push('/owner/dashboard', 'root');
        }
      } else {
        present({
          message: 'Invalid email or password',
          duration: 2000,
          color: 'danger',
        });
      }

      setLoading(false);
    }, 500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Welcome to Booklyst</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="login-content" fullscreen>
        <div className="login-container">
          <div className="login-header">
            <h1>Sign In</h1>
            <p className="text-secondary">Find your perfect event venue</p>
          </div>

          <div className="login-form">
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
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonInput
                type="password"
                placeholder="Password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                clearInput
              />
            </IonItem>

            <div className="remember-forgot">
              <IonItem lines="none" className="checkbox-item">
                <IonCheckbox
                  checked={rememberMe}
                  onIonChange={(e) => setRememberMe(e.detail.checked)}
                  slot="start"
                />
                <IonLabel>Remember me</IonLabel>
              </IonItem>

              <IonText color="primary" className="forgot-password">
                Forgot password?
              </IonText>
            </div>

            <IonButton
              expand="block"
              className="login-button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </IonButton>

            <div className="divider">
              <span>or</span>
            </div>

            <IonButton
              expand="block"
              fill="outline"
              color="primary"
              routerLink="/register"
            >
              Create Account
            </IonButton>
          </div>

          <div className="test-accounts">
            <IonText color="medium">
              <p><strong>Test Accounts:</strong></p>
              <p>Customer: customer@test.com / password123</p>
              <p>Owner: owner@test.com / password123</p>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
