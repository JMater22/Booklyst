import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

/* Pages */
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/customer/Home';
import Profile from './pages/customer/Profile';
import VenueDetails from './pages/customer/VenueDetails';
import BookingFlow from './pages/customer/BookingFlow';
import MyBookings from './pages/customer/MyBookings';
import Favorites from './pages/customer/Favorites';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import VenueForm from './pages/owner/VenueForm';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/venue/:id" component={VenueDetails} />
        <Route exact path="/booking/:id" component={BookingFlow} />
        <Route exact path="/bookings" component={MyBookings} />
        <Route exact path="/favorites" component={Favorites} />
        <Route exact path="/owner/dashboard" component={OwnerDashboard} />
        <Route exact path="/owner/venues/new" component={VenueForm} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
