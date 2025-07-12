import React, { useState } from 'react';
import { Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FullScreenImageModal } from '@/components/FullScreenImageModal';
import { saveDesign } from '@/lib/api';
import { useAuth } from '@clerk/clerk-expo';
import { AppScreenLayout } from '@/components/AppScreenLayout';

interface DesignResult {
  imageUrl: string;
  shape: string;
  length: string;
  style: string;
  colors: string[];
}

const ResultsScreen = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const modelResults: string[] = params.modelResults
    ? JSON.parse(params.modelResults as string)
    : [];
  const designData: Omit<DesignResult, 'imageUrl'> = params.designData
    ? JSON.parse(params.designData as string)
    : {};

  const handleSaveDesign = async (imageUrl: string) => {
    if (!isSignedIn) {
      Alert.alert('Login Required', 'Please log in to save your designs.');
      return;
    }

    setLoading(true);
    try {
      await saveDesign({ ...designData, imageUrl });
      setSavedStates((prev) => ({ ...prev, [imageUrl]: true }));
      Alert.alert('Success', 'Design saved successfully!');
    } catch (error: any) {
      console.error('Failed to save design:', error);
      Alert.alert('Error', error.message || 'Failed to save design.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.card}>
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.overlay}>
        <Pressable
          style={styles.iconButton}
          onPress={() => handleSaveDesign(item)}
          disabled={savedStates[item] || loading || !isLoaded}>
          <IconSymbol
            name={savedStates[item] ? 'checkmark.circle.fill' : 'square.and.arrow.down'}
            size={24}
            color={savedStates[item] ? 'green' : 'white'}
          />
        </Pressable>
        <Pressable
          style={styles.iconButton}
          onPress={() => setFullScreenImage(item)}>
          <IconSymbol name="arrow.up.right.and.arrow.down.left.rectangle" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Saving design...</Text>
      </View>
    );
  }

  return (
    <AppScreenLayout>
      {modelResults.length > 0 ? (
        <FlatList
          data={modelResults}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={2} // Display in a grid
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <Text>No designs generated. Please go back and try again.</Text>
      )}
      {fullScreenImage && (
        <FullScreenImageModal
          visible={!!fullScreenImage}
          imageUrl={fullScreenImage}
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </AppScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0,
  },
  iconButton: {
    padding: 8,
  },
});

export default ResultsScreen;