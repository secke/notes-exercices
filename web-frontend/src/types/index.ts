export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface Note {
  id: number;
  title: string;
  contentMd: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  tags: string[];
  ownerId: number;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
  shares?: Share[];
  publicLink?: PublicLink;
}

export interface NoteListItem {
  id: number;
  title: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  tags: string[];
  ownerEmail: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  contentMd: string;
  tags: string[];
}

export interface UpdateNoteRequest {
  title?: string;
  contentMd?: string;
  tags?: string[];
  visibility?: 'PRIVATE' | 'SHARED' | 'PUBLIC';
}

export interface Share {
  id: number;
  noteId: number;
  sharedWithEmail: string;
  permission: 'READ';
}

export interface PublicLink {
  id: number;
  urlToken: string;
  fullUrl: string;
  createdAt: string;
  expiresAt?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
}
