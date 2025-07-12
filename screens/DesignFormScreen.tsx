import React, { useState } from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NailLengthSelector from '@/components/design/NailLengthSelector';
import NailShapeSelector from '@/components/design/NailShapeSelector';
import NailStyleSelector from '@/components/design/NailStyleSelector';
import ColorHarmonySelector from '@/components/design/ColorHarmonySelector';
import { AppScreenLayout } from '@/components/AppScreenLayout';

const DesignFormScreen = () => {
  const navigation = useNavigation();
  const [activeRow, setActiveRow] = useState('length');
  const [selections, setSelections] = useState({
    length: null,
    shape: null,
    style: null,
    colorHarmony: null,
  });

  const handleSelect = (row, value) => {
    setSelections(prev => ({ ...prev, [row]: value }));
    // Advance to the next row
    if (row === 'length') setActiveRow('shape');
    if (row === 'shape') setActiveRow('style');
    if (row === 'style') setActiveRow('colorHarmony');
    if (row === 'colorHarmony') setActiveRow(null); // All selections made
  };

  const allSelectionsMade = Object.values(selections).every(s => s !== null);

  return (
    <AppScreenLayout>
      <ScrollView style={styles.container}>
        <NailLengthSelector
          onSelect={(value) => handleSelect('length', value)}
          selectedValue={selections.length}
          isActive={activeRow === 'length'}
          onEdit={() => setActiveRow('length')}
        />
        <NailShapeSelector
          onSelect={(value) => handleSelect('shape', value)}
          selectedValue={selections.shape}
          isActive={activeRow === 'shape'}
          onEdit={() => setActiveRow('shape')}
        />
        <NailStyleSelector
          onSelect={(value) => handleSelect('style', value)}
          selectedValue={selections.style}
          isActive={activeRow === 'style'}
          onEdit={() => setActiveRow('style')}
        />
        <ColorHarmonySelector
          onSelect={(value) => handleSelect('colorHarmony', value)}
          selectedValue={selections.colorHarmony}
          isActive={activeRow === 'colorHarmony'}
          onEdit={() => setActiveRow('colorHarmony')}
        />

        {allSelectionsMade && (
          <TouchableOpacity style={styles.impressButton} onPress={() => navigation.navigate('results' as never, { selections })}>
            <Text style={styles.impressButtonText}>Impress Me</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </AppScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  impressButton: {
    backgroundColor: '#007bff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  impressButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DesignFormScreen;
