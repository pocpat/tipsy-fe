import * as SecureStore from 'expo-secure-store'; // This import is correct, the error is likely due to missing type definitions.

export async function saveToken(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.error("Failed to save token to secure store", err);
  }
}

export async function getToken(key: string) {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.error("Failed to get token from secure store", err);
    return null;
  }
}

export const tokenCache = {
  getToken,
  saveToken,
};