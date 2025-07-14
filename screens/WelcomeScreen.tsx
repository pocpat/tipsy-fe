import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
// 1. Remove SignOutButton from the import, but get `signOut` from the useAuth hook
import { useAuth, useOAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  // 2. Destructure the signOut function from the useAuth hook
  const { isLoaded, isSignedIn, signOut } = useAuth();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onSignInPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error("OAuth Error:", JSON.stringify(err, null, 2));
      Alert.alert("Login Error", err.errors?.[0]?.message || "An unexpected error occurred.");
    }
  }, [startOAuthFlow]);

  // 3. Create a simple handler function to call signOut
  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("SignOut Error:", err);
      Alert.alert("Logout Error", "An unexpected error occurred during logout.");
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipsy</Text>
      <Text style={styles.subtitle}>AI Nail Design Studio</Text>

      <TouchableOpacity
        style={[styles.button, !isSignedIn && styles.buttonDisabled]}
        onPress={() => navigation.navigate('DesignForm')}
        disabled={!isSignedIn}>
        <Text style={styles.buttonText}>Press to start</Text>
      </TouchableOpacity>

      <View style={styles.authButtons}>
        {isSignedIn ? (
          // 4. Use a regular TouchableOpacity and call your new handler on press
          <TouchableOpacity onPress={onSignOutPress}>
            <Text style={styles.authButtonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onSignInPress}>
            <Text style={styles.authButtonText}>Login / Sign Up with Google</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdfbff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  authButtons: {
    flexDirection: 'row',
  },
  authButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default WelcomeScreen;