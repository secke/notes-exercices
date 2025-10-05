import { create } from 'zustand';
import type { NoteListItem, Note } from '../types';
import { notesApi } from '../lib/api';

interface NotesState {
  notes: NoteListItem[];
  currentNote: Note | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  
  // Filtres
  searchQuery: string;
  selectedTag: string;
  selectedVisibility: string;
  
  fetchNotes: (page?: number) => Promise<void>;
  fetchNoteById: (id: number) => Promise<void>;
  createNote: (data: any) => Promise<Note>;
  updateNote: (id: number, data: any) => Promise<Note>;
  deleteNote: (id: number) => Promise<void>;
  
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string) => void;
  setSelectedVisibility: (visibility: string) => void;
  clearFilters: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  currentNote: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  isLoading: false,
  error: null,
  
  searchQuery: '',
  selectedTag: '',
  selectedVisibility: '',

  fetchNotes: async (page = 0) => {
    set({ isLoading: true, error: null });
    try {
      const { searchQuery, selectedTag, selectedVisibility } = get();
      
      const response = await notesApi.getAll({
        query: searchQuery || undefined,
        tag: selectedTag || undefined,
        visibility: selectedVisibility || undefined,
        page,
        size: 10,
      });
      
      set({
        notes: response.content,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        currentPage: page,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch notes',
        isLoading: false,
      });
    }
  },

  fetchNoteById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesApi.getById(id);
      set({ currentNote: note, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch note',
        isLoading: false,
      });
    }
  },

  createNote: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesApi.create(data);
      set({ isLoading: false });
      return note;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create note',
        isLoading: false,
      });
      throw error;
    }
  },

  updateNote: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const note = await notesApi.update(id, data);
      set({ currentNote: note, isLoading: false });
      return note;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update note',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await notesApi.delete(id);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete note',
        isLoading: false,
      });
      throw error;
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchNotes(0);
  },

  setSelectedTag: (tag) => {
    set({ selectedTag: tag });
    get().fetchNotes(0);
  },

  setSelectedVisibility: (visibility) => {
    set({ selectedVisibility: visibility });
    get().fetchNotes(0);
  },

  clearFilters: () => {
    set({ searchQuery: '', selectedTag: '', selectedVisibility: '' });
    get().fetchNotes(0);
  },
}));