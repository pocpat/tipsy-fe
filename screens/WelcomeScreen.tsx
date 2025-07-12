import { useAuth, useOAuth } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = () => {
  const { isSignedIn } = useAuth();
  const navigation = useNavigation();

  const { startOAuthFlow } = useOAuth({
    strategy: 'oauth_google',
  });

  const onSignInPress = React.useCallback(async () => {
    console.log('onSignInPress called');
    try {
      console.log('Before startOAuthFlow');
      const redirectUrl = WebBrowser.makeRedirectUri({ scheme: 'tipsyfe' });
      console.log('Redirect URL:', redirectUrl);
      const { createdSessionId, setActive } = await startOAuthFlow({ redirectUrl });
      console.log('After startOAuthFlow');
      console.log('OAuth flow completed.');

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      Alert.alert("Login Error", err.message || "An unexpected error occurred during login.");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipsy</Text>
      <Text style={styles.subtitle}>AI Nail Design Studio</Text>

      <TouchableOpacity
        style={[styles.button, !isSignedIn && styles.buttonDisabled]}
        onPress={() => navigation.navigate('design' as never)}
        disabled={!isSignedIn}>
        <Text style={styles.buttonText}>Press to start</Text>
      </TouchableOpacity>

      <View style={styles.authButtons}>
        <TouchableOpacity onPress={onSignInPress}>
          <Text style={styles.authButtonText}>Login / Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
