import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cyou.sk5s.app.weread',
  appName: 'Weread',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    EdgeToEdge: {
      backgroundColor: "#000000",
    },
  },
};

export default config;
