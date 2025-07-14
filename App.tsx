import React from 'react';
import { ClerkProvider } from "@clerk/clerk-expo";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';

// 1. Make sure your tokenCache is imported correctly
import { tokenCache } from './lib/tokenCache';

// 2. Import all your screens
import WelcomeScreen from "./screens/WelcomeScreen";
import DesignFormScreen from "./screens/DesignFormScreen";
import ResultsScreen from "./screens/ResultsScreen";
import MyDesignsScreen from "./screens/MyDesignsScreen";

const Stack = createNativeStackNavigator();

// 3. Retrieve the key from the "extra" object in your app.config.js
const clerkPublishableKey = Constants.expoConfig?.extra?.clerkPublishableKey;

if (!clerkPublishableKey) {
  // This error is helpful for debugging if the key is missing from app.config.js
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Check app.config.js");
}

export default function App() {
  return (
    // This is the correct usage. If the error persists after reinstall, the issue is deep in the node_modules.
    <ClerkProvider 
      publishableKey={clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }} 
          />
          {/* Add your other screens to the navigator */}
          <Stack.Screen name="DesignForm" component={DesignFormScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="MyDesigns" component={MyDesignsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ClerkProvider>
  );
}