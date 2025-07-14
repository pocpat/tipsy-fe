import 'dotenv/config';
export default {
  "expo": {
    "name": "tipsy-fe",
    "slug": "tipsy-fe",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "tipsyfe",
    "userInterfaceStyle": "automatic",
    "splash": { // Note: The old splash screen config is now nested under "splash"
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.anonymous.tipsyfe" // It's good practice to add a package name
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store" // This is correct
    ],
    "experiments": {
      "typedRoutes": true
    },
    // 3. CRITICAL: Custom keys MUST go inside the "extra" object
    "extra": {
      "clerkPublishableKey": process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      // You can add other env vars here too if needed
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID" // You'll need this for builds
      }
    }
  }
};