import React, { useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, Alert, Switch, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FullScreenImageModal } from '@/components/FullScreenImageModal';
import { getMyDesigns, deleteDesign, toggleFavorite } from '@/lib/api';
import { useAuth } from '@clerk/clerk-expo';
import { AppScreenLayout } from '@/components/AppScreenLayout';

interface Design {
  _id: string;
  userId: string;
  imageUrl: string;
  shape: string;
  length: string;
  style: string;
  colors: string[];
  isFavorite: boolean;
  createdAt: string;
}

export default function MyDesignsScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const fetchDesigns = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getMyDesigns();
      setDesigns(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch designs');
    } finally {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  useFocusEffect(
    useCallback(() => {
      fetchDesigns();
    }, [fetchDesigns])
  );

  const handleDeleteDesign = async (designId: string) => {
    Alert.alert(
      'Delete Design',
      'Are you sure you want to delete this design?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteDesign(designId);
              setDesigns((prevDesigns) =>
                prevDesigns.filter((design) => design._id !== designId)
              );
              Alert.alert('Success', 'Design deleted successfully!');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete design');
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (designId: string) => {
    try {
      const updatedDesign = await toggleFavorite(designId);
      setDesigns((prevDesigns) =>
        prevDesigns.map((design) =>
          design._id === designId ? updatedDesign.design : design
        )
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to toggle favorite status');
    }
  };

  const filteredDesigns = showFavoritesOnly
    ? designs.filter((design) => design.isFavorite)
    : designs;

  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    if (showFavoritesOnly) {
      return 0; // No additional sorting if only favorites are shown
    }
    // Sort by createdAt descending (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading designs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Please log in to view your designs.</Text>
      </View>
    );
  }

  return (
    <AppScreenLayout>
      <View style={styles.toggleContainer}>
        <Text>Show Favorites Only</Text>
        <Switch
          value={showFavoritesOnly}
          onValueChange={setShowFavoritesOnly}
        />
      </View>
      {sortedDesigns.length > 0 ? (
        <FlatList
          data={sortedDesigns}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.overlay}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => handleToggleFavorite(item._id)}
                >
                  <IconSymbol
                    name={item.isFavorite ? 'heart.fill' : 'heart'}
                    size={24}
                    color={item.isFavorite ? 'red' : 'white'}
                  />
                </Pressable>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => setFullScreenImage(item.imageUrl)}
                >
                  <IconSymbol name="arrow.up.right.and.arrow.down.left.rectangle" size={24} color="white" />
                </Pressable>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => handleDeleteDesign(item._id)}
                >
                  <IconSymbol name="trash.fill" size={24} color="white" />
                </Pressable>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <Text>No designs saved yet.</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
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


