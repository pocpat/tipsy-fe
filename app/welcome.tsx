import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const WelcomeScreen = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // This should not happen based on the layout logic, but as a safeguard:
  if (isSignedIn) {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tipsy</Text>
      <Text style={styles.subtitle}>AI Nail Design Studio</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.buttonText}>Press to start</Text>
      </TouchableOpacity>

      <View style={styles.authButtons}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
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
