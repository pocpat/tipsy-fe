import React from 'react';
import { View, StyleSheet } from 'react-native';

interface AppScreenLayoutProps {
  children: React.ReactNode;
}

export function AppScreenLayout({ children }: AppScreenLayoutProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
