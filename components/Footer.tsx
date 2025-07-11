import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { ThemedText } from './ThemedText';

export function Footer() {
  return (
    <View style={styles.footerContainer}>
      <ThemedText style={styles.footerText}>
        © 2025 Tipsy App. All rights reserved.
      </ThemedText>
      <View style={styles.footerLinks}>
        <ThemedText style={styles.link} onPress={() => Linking.openURL('#')}>
          Terms of Service
        </ThemedText>
        <ThemedText style={styles.link} onPress={() => Linking.openURL('#')}>
          Privacy Policy
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
  },
  footerLinks: {
    flexDirection: 'row',
    marginTop: 8,
  },
  link: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 8,
    textDecorationLine: 'underline',
  },
});
