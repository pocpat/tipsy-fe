import { ClerkProvider } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MainHeader } from '../components/MainHeader';
import { Footer } from '../components/Footer';

// Import your screens
import WelcomeScreen from '../screens/WelcomeScreen';
import DesignFormScreen from '../screens/DesignFormScreen';
import ResultsScreen from '../screens/ResultsScreen';
import MyDesignsScreen from '../screens/MyDesignsScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file.');
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <Stack.Navigator>
            <Stack.Screen name="welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="design" component={DesignFormScreen} options={{ header: () => <MainHeader /> }} />
            <Stack.Screen name="results" component={ResultsScreen} options={{ header: () => <MainHeader /> }} />
            <Stack.Screen name="my-designs" component={MyDesignsScreen} options={{ header: () => <MainHeader /> }} />
            <Stack.Screen name="+not-found" component={NotFoundScreen} options={{ header: () => <MainHeader /> }} />
          </Stack.Navigator>
          <Footer />
          <StatusBar style="auto" />
        </PaperProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
