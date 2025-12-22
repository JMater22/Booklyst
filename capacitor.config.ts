import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.booklyst.app',
  appName: 'booklyst',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
