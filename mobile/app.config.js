export default {
  expo: {
    name: "Nieri Creative",
    slug: "nieri-creative-client-app",
    version: "0.1.0",
    orientation: "portrait",
    scheme: "niericreative",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.niericreative.clientapp",
    },
    android: {
      package: "com.niericreative.clientapp",
    },
    web: {
      bundler: "metro",
    },
    plugins: ["expo-web-browser"],
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      aryeoOrderFormUrl: process.env.EXPO_PUBLIC_ARYEO_ORDER_FORM_URL,
    },
  },
};
