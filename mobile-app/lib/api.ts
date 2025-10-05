import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { AuthResponse, Note } from '../types';

// Détection de l'URL API selon la plateforme
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // Android Emulator
    return 'http://10.0.2.2:8080/api';
  }
  if (Platform.OS === 'ios') {
    // iOS Simulator
    return 'http://localhost:8080/api';
  }
  // Web
  return 'http://localhost:8080/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/v1/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/v1/auth/login', { email, password });
    return response.data;
  },
};

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const response = await api.get('/v1/notes', {
      params: { page: 0, size: 100 },
    });
    return response.data.content;
  },

  getById: async (id: number): Promise<Note> => {
    const response = await api.get(`/v1/notes/${id}`);
    return response.data;
  },

  create: async (data: { title: string; contentMd: string; tags: string[] }): Promise<Note> => {
    const response = await api.post('/v1/notes', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<Note> => {
    const response = await api.put(`/v1/notes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/notes/${id}`);
  },
};

export default api;
