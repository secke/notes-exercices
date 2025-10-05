import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';
import { syncService } from '../lib/sync';
import { storageService } from '../lib/storage';
import type { Note, SyncStatus } from '../types';

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  syncStatus: SyncStatus;

  fetchNotes: () => Promise<void>;
  refreshNotes: () => Promise<void>;
  getNoteById: (id: number) => Promise<void>;
  createNote: (data: { title: string; contentMd: string; tags: string[] }) => Promise<Note>;
  updateNote: (id: number, data: any) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  syncNow: () => Promise<void>;
  updateSyncStatus: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  syncStatus: {
    lastSync: null,
    pendingOperations: 0,
    isOnline: true,
    isSyncing: false,
  },

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      // Charger depuis le cache local d'abord
      const cachedNotes = await storageService.getNotes();
      set({ notes: cachedNotes.filter(n => !n.pendingDelete) });

      // Synchroniser depuis le serveur si en ligne
      const notes = await syncService.syncFromServer();
      set({ notes: notes.filter(n => !n.pendingDelete), isLoading: false });

      await get().updateSyncStatus();
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch notes',
        isLoading: false,
      });
    }
  },

  refreshNotes: async () => {
    set({ isRefreshing: true });
    try {
      await get().syncNow();
      await get().fetchNotes();
    } finally {
      set({ isRefreshing: false });
    }
  },

  getNoteById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const note = await storageService.getNoteById(id);
      set({ currentNote: note, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch note',
        isLoading: false,
      });
    }
  },

  createNote: async (data) => {
    try {
      const note = await syncService.createNoteOffline(data);
      
      // Mettre à jour la liste locale
      const { notes } = get();
      set({ notes: [note, ...notes] });
      
      await get().updateSyncStatus();
      return note;
    } catch (error: any) {
      set({ error: error.message || 'Failed to create note' });
      throw error;
    }
  },

  updateNote: async (id, data) => {
    try {
      const note = await syncService.updateNoteOffline(id, data);
      
      // Mettre à jour la liste locale
      const { notes } = get();
      const updated = notes.map((n) => (n.id === id ? note : n));
      set({ notes: updated, currentNote: note });
      
      await get().updateSyncStatus();
      return note;
    } catch (error: any) {
      set({ error: error.message || 'Failed to update note' });
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await syncService.deleteNoteOffline(id);
      
      // Mettre à jour la liste locale
      const { notes } = get();
      const filtered = notes.map(n => 
        n.id === id ? { ...n, pendingDelete: true } : n
      );
      set({ notes: filtered });
      
      await get().updateSyncStatus();
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete note' });
      throw error;
    }
  },

  syncNow: async () => {
    const { syncStatus } = get();
    if (syncStatus.isSyncing) return;

    set({
      syncStatus: { ...syncStatus, isSyncing: true },
    });

    try {
      await syncService.syncToServer();
      await syncService.syncFromServer();
      await get().updateSyncStatus();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      set({
        syncStatus: { ...get().syncStatus, isSyncing: false },
      });
    }
  },

  updateSyncStatus: async () => {
    const isOnline = await syncService.isOnline();
    const lastSync = await storageService.getLastSyncTime();
    const pendingOps = await storageService.getPendingOperations();

    set({
      syncStatus: {
        ...get().syncStatus,
        isOnline,
        lastSync,
        pendingOperations: pendingOps.length,
      },
    });
  },
}));

// Listen to network changes
NetInfo.addEventListener((state) => {
  useNotesStore.getState().updateSyncStatus();
  
  // Auto-sync when coming back online
  if (state.isConnected) {
    useNotesStore.getState().syncNow();
  }
});