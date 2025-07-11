import { getAuth } from '@clerk/clerk-expo';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface DesignFormData {
  shape: string;
  length: string;
  style: string;
  colors: string[];
  colorHarmony: string;
}

interface SaveDesignData {
  imageUrl: string;
  shape: string;
  length: string;
  style: string;
  colors: string[];
}

export async function generateDesigns(formData: DesignFormData) {
  const { getToken } = getAuth();
  const token = await getToken();

  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to generate designs');
  }

  return response.json();
}

export async function saveDesign(designData: SaveDesignData) {
  const { getToken } = getAuth();
  const token = await getToken();

  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/save-design`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(designData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to save design');
  }

  return response.json();
}

export async function getMyDesigns() {
  const { getToken } = getAuth();
  const token = await getToken();

  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/my-designs`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch designs');
  }

  return response.json();
}

export async function deleteDesign(designId: string) {
  const { getToken } = getAuth();
  const token = await getToken();

  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/designs/${designId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete design');
  }

  return response.json();
}

export async function toggleFavorite(designId: string) {
  const { getToken } = getAuth();
  const token = await getToken();

  if (!token) {
    throw new Error('No authentication token found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/designs/${designId}/favorite`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to toggle favorite status');
  }

  return response.json();
}
