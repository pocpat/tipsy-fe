import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const ResultsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;
