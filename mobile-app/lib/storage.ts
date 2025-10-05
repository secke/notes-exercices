import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Note, PendingOperation } from '../types';

const NOTES_KEY = 'notes_cache';
const PENDING_OPS_KEY = 'pending_operations';
const SYNC_STATUS_KEY = 'sync_status';

export const storageService = {
  // Notes cache
  getNotes: async (): Promise<Note[]> => {
    try {
      const data = await AsyncStorage.getItem(NOTES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading notes from cache:', error);
      return [];
    }
  },

  saveNotes: async (notes: Note[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to cache:', error);
    }
  },

  getNoteById: async (id: number): Promise<Note | null> => {
    const notes = await storageService.getNotes();
    return notes.find((n) => n.id === id) || null;
  },

  addOrUpdateNote: async (note: Note): Promise<void> => {
    const notes = await storageService.getNotes();
    const index = notes.findIndex((n) => n.id === note.id || n.localId === note.localId);
    
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.push(note);
    }
    
    await storageService.saveNotes(notes);
  },

  deleteNote: async (id: number): Promise<void> => {
    const notes = await storageService.getNotes();
    const filtered = notes.filter((n) => n.id !== id);
    await storageService.saveNotes(filtered);
  },

  // Pending operations
  getPendingOperations: async (): Promise<PendingOperation[]> => {
    try {
      const data = await AsyncStorage.getItem(PENDING_OPS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading pending operations:', error);
      return [];
    }
  },

  addPendingOperation: async (operation: PendingOperation): Promise<void> => {
    const ops = await storageService.getPendingOperations();
    ops.push(operation);
    await AsyncStorage.setItem(PENDING_OPS_KEY, JSON.stringify(ops));
  },

  removePendingOperation: async (id: string): Promise<void> => {
    const ops = await storageService.getPendingOperations();
    const filtered = ops.filter((op) => op.id !== id);
    await AsyncStorage.setItem(PENDING_OPS_KEY, JSON.stringify(filtered));
  },

  clearPendingOperations: async (): Promise<void> => {
    await AsyncStorage.removeItem(PENDING_OPS_KEY);
  },

  // Sync status
  getLastSyncTime: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(SYNC_STATUS_KEY);
  },

  setLastSyncTime: async (timestamp: string): Promise<void> => {
    await AsyncStorage.setItem(SYNC_STATUS_KEY, timestamp);
  },

  // Clear all data
  clearAll: async (): Promise<void> => {
    await AsyncStorage.multiRemove([NOTES_KEY, PENDING_OPS_KEY, SYNC_STATUS_KEY]);
  },
};