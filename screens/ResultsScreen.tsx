import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FullScreenImageModal } from '@/components/FullScreenImageModal';
import { saveDesign, generateDesigns } from '@/lib/api';
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
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const route = useRoute();
  const { selections } = route.params as { selections: any };
  const [loading, setLoading] = useState(false);
  const [savedStates, setSavedStates] = useState<{ [key: string]: boolean }>({});
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchDesigns = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await generateDesigns(selections, getToken);
      console.log('Setting generated images:', response.data);
      setGeneratedImages(response.data);
    } catch (error: any) {
      console.error('Failed to generate designs:', error);
      setApiError(error.message || 'Failed to generate designs.');
    } finally {
      setLoading(false);
    }
  }, [selections, getToken]);

  useEffect(() => {
    if (selections) {
      fetchDesigns();
    }
  }, [selections, fetchDesigns]);

  const modelResults: string[] = generatedImages;
  const designData: Omit<DesignResult, 'imageUrl'> = selections;

  const handleSaveDesign = async (imageUrl: string) => {
    if (!isSignedIn) {
      Alert.alert('Login Required', 'Please log in to save your designs.');
      return;
    }

    setLoading(true);
    try {
      await saveDesign({ ...designData, imageUrl }, getToken);
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
        <Text>Generating designs...</Text>
      </View>
    );
  }

  if (apiError) {
    return (
      <AppScreenLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {apiError}</Text>
          <Pressable style={styles.retryButton} onPress={() => fetchDesigns()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </AppScreenLayout>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ResultsScreen;