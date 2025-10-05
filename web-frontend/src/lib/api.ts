import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Note,
  NoteListItem,
  CreateNoteRequest,
  UpdateNoteRequest,
  PaginatedResponse,
  Share,
  PublicLink
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth API ====================
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/v1/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

// ==================== Notes API ====================
export const notesApi = {
  getAll: async (params: {
    query?: string;
    tag?: string;
    visibility?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<NoteListItem>> => {
    const response = await api.get<PaginatedResponse<NoteListItem>>('/v1/notes', {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Note> => {
    const response = await api.get<Note>(`/v1/notes/${id}`);
    return response.data;
  },

  create: async (data: CreateNoteRequest): Promise<Note> => {
    const response = await api.post<Note>('/v1/notes', data);
    return response.data;
  },

  update: async (id: number, data: UpdateNoteRequest): Promise<Note> => {
    const response = await api.put<Note>(`/v1/notes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/v1/notes/${id}`);
  },
};

// ==================== Share API ====================
export const shareApi = {
  shareWithUser: async (noteId: number, email: string): Promise<Share> => {
    const response = await api.post<Share>(`/v1/notes/${noteId}/share/user`, {
      email,
    });
    return response.data;
  },

  deleteShare: async (shareId: number): Promise<void> => {
    await api.delete(`/v1/notes/shares/${shareId}`);
  },

  createPublicLink: async (noteId: number): Promise<PublicLink> => {
    const response = await api.post<PublicLink>(
      `/v1/notes/${noteId}/share/public`,
      {}
    );
    return response.data;
  },

  deletePublicLink: async (linkId: number): Promise<void> => {
    await api.delete(`/v1/public-links/${linkId}`);
  },
};

// ==================== Public API (sans authentification) ====================
export const publicApi = {
  getNoteByToken: async (token: string): Promise<Note> => {
    const response = await axios.get<Note>(`${API_URL}/v1/public/notes/${token}`);
    return response.data;
  },
};