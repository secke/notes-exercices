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
  // Champs locaux pour offline
  localId?: string;
  synced?: boolean;
  pendingDelete?: boolean;
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

export interface PendingOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  noteId?: number;
  localId?: string;
  data: any;
  timestamp: number;
}

export interface SyncStatus {
  lastSync: string | null;
  pendingOperations: number;
  isOnline: boolean;
  isSyncing: boolean;
}