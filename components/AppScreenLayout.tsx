import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MainHeader } from '@/components/MainHeader';
import { Footer } from '@/components/Footer';

interface AppScreenLayoutProps {
  children: React.ReactNode;
}

export function AppScreenLayout({ children }: AppScreenLayoutProps) {
  return (
    <View style={styles.container}>
      <MainHeader />
      <View style={styles.content}>{children}</View>
      <Footer />
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
