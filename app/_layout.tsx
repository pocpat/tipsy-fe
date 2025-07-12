import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, ThemeProvider, useNavigationContainerRef } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Linking from 'expo-linking';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.');
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
   const navigationRef = useNavigationContainerRef();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        welcome: 'welcome',
        design: 'design',
        results: 'results',
        'my-designs': 'my-designs',
        '+not-found': '*unmatched',
      },
    },
  };
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen name="design" options={{ headerShown: false }} />
            <Stack.Screen name="results" options={{ headerShown: false }} />
            <Stack.Screen name="my-designs" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </PaperProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
