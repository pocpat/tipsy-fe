import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const OPTIONS = ['Analogous', 'Complementary', 'Triadic', 'Monochromatic'];

const ColorHarmonySelector = ({ onSelect, selectedValue, isActive, onEdit }) => {
  return (
    <TouchableOpacity onPress={onEdit} disabled={isActive}>
      <View style={[styles.container, !isActive && styles.inactive]}>
        <Text style={styles.label}>Color Harmony</Text>
        <View style={styles.optionsContainer}>
          {OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedValue === option && styles.selectedOption,
              ]}
              onPress={() => onSelect(option)}
              disabled={!isActive}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  inactive: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 16,
  },
});

export default ColorHarmonySelector;
