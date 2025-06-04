
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.70867db49c7c4a30ae32e79c7e0bfff6',
  appName: 'tastee-event-gatherings',
  webDir: 'dist',
  server: {
    url: 'https://70867db4-9c7c-4a30-ae32-e79c7e0bfff6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10B981',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#10B981'
    }
  }
};

export default config;
