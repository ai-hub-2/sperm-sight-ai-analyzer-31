
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9ff24dbaca6d46878e5af9d216ad7b29',
  appName: 'sperm-sight-ai-analyzer-31',
  webDir: 'dist',
  server: {
    url: 'https://9ff24dba-ca6d-4687-8e5a-f9d216ad7b29.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Filesystem: {
      permissions: ['documents']
    }
  }
};

export default config;
