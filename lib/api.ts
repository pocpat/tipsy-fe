import { GetToken } from '@clerk/types';

// 1. --- RUNTIME ENVIRONMENT VARIABLE CHECK ---
// This ensures the app fails loudly during development if the .env file is misconfigured.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("Fatal Error: EXPO_PUBLIC_API_BASE_URL is not defined. Please check your .env file.");
}


// 2. --- DEFINE SHARED TYPES ---
// Define the shape of the data coming back from your API for better type safety.
export interface Design {
  _id: string; // MongoDB IDs are strings
  userId: string;
  imageUrl: string;
  shape: string;
  length: string;
  style: string;
  colors: string[];
  isFavorite: boolean;
  createdAt: string; // Dates are usually strings in JSON
}

// Interfaces for function parameters.
export interface DesignFormData {
  shape: string;
  length: string;
  style: string;
  colors: string[];
  colorHarmony: string;
}

export interface SaveDesignData {
  imageUrl: string;
  shape: string;
  length: string;
  style: string;
  colors: string[];
}


// 3. --- CENTRALIZED API FETCH HELPER ---
// This helper function handles all the repeated logic for authentication and fetching.
async function apiFetch<T>(
  endpoint: string,
  getToken: GetToken,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  if (!token) {
    throw new Error('Authentication token not found. Please log in.');
  }

  // Set default headers and merge with any custom options
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      // Try to parse a structured error message from the backend
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      // If parsing fails, use the raw response text as a fallback
    }
    throw new Error(errorMessage);
  }
  
  // Handle responses with no content (like a successful DELETE)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}


// 4. --- SIMPLIFIED PUBLIC API FUNCTIONS ---
// Each function is now a clean, simple one-liner that calls our central helper.

export function generateDesigns(formData: DesignFormData, getToken: GetToken) {
  // Assuming the backend returns an object with a modelResults array
  return apiFetch<{ modelResults: string[] }>('/api/generate', getToken, {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export function saveDesign(designData: SaveDesignData, getToken: GetToken) {
  return apiFetch<Design>('/api/save-design', getToken, {
    method: 'POST',
    body: JSON.stringify(designData),
  });
}

export function getMyDesigns(getToken: GetToken) {
  return apiFetch<Design[]>('/api/my-designs', getToken, { method: 'GET' });
}

export function deleteDesign(designId: string, getToken: GetToken) {
  return apiFetch<void>(`/api/designs/${designId}`, getToken, { method: 'DELETE' });
}

export function toggleFavorite(designId: string, getToken: GetToken) {
  return apiFetch<Design>(`/api/designs/${designId}/favorite`, getToken, { method: 'PATCH' });
}