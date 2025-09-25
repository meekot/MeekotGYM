import type { ExpoConfig } from '@expo/config-types';

const config: ExpoConfig = {
  name: 'MeekotGYM',
  slug: 'meekotgym',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'meekotgym',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android', 'web'],
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#111827',
    },
  },
  web: {
    bundler: 'metro',
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
  },
};

export default config;
