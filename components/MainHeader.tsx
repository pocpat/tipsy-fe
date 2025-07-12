import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Menu, Appbar, Divider } from 'react-native-paper';

import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function MainHeader() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const navigation = useNavigation();
  const { isSignedIn } = useUser();
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();

  const handleNavigation = (path: string) => {
    navigation.navigate(path as never);
    closeMenu();
  };

  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  return (
    <Appbar.Header style={{ backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <ThemedText style={styles.logo}>Tipsy</ThemedText>
      <View style={styles.menuContainer}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
          {isSignedIn && (
            <Menu.Item
              onPress={() => handleNavigation('/my-designs')}
              title="My Designs"
            />
          )}
          <Menu.Item
            onPress={() => handleNavigation('/design')}
            title="Start Over"
          />
          <Divider />
          {isSignedIn ? (
            <Menu.Item onPress={handleSignOut} title="Logout" />
          ) : (
            <Menu.Item
              onPress={() => handleNavigation('/welcome')}
              title="Login"
            />
          )}
        </Menu>
      </View>
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  menuContainer: {
    marginLeft: 'auto',
  },
});
