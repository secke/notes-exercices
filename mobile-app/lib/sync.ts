import NetInfo from '@react-native-community/netinfo';
import { notesApi } from './api';
import { storageService } from './storage';
import type { Note, PendingOperation } from '../types';

export const syncService = {
  // Vérifier la connexion
  isOnline: async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  // Synchroniser les notes depuis le serveur
  syncFromServer: async (): Promise<Note[]> => {
    try {
      const online = await syncService.isOnline();
      if (!online) {
        return await storageService.getNotes();
      }

      const serverNotes = await notesApi.getAll();
      
      // Mettre à jour le cache local
      await storageService.saveNotes(serverNotes.map(note => ({
        ...note,
        synced: true,
      })));

      // Mettre à jour le timestamp de sync
      await storageService.setLastSyncTime(new Date().toISOString());

      return serverNotes;
    } catch (error) {
      console.error('Error syncing from server:', error);
      // Retourner les notes en cache en cas d'erreur
      return await storageService.getNotes();
    }
  },

  // Synchroniser les opérations en attente vers le serveur
  syncToServer: async (): Promise<void> => {
    try {
      const online = await syncService.isOnline();
      if (!online) {
        console.log('Offline: pending operations will sync later');
        return;
      }

      const pendingOps = await storageService.getPendingOperations();
      
      for (const op of pendingOps) {
        try {
          switch (op.type) {
            case 'CREATE':
              const created = await notesApi.create(op.data);
              // Mettre à jour la note locale avec l'ID du serveur
              await storageService.addOrUpdateNote({ ...created, synced: true });
              break;

            case 'UPDATE':
              if (op.noteId) {
                const updated = await notesApi.update(op.noteId, op.data);
                await storageService.addOrUpdateNote({ ...updated, synced: true });
              }
              break;

            case 'DELETE':
              if (op.noteId) {
                await notesApi.delete(op.noteId);
                await storageService.deleteNote(op.noteId);
              }
              break;
          }

          // Supprimer l'opération de la file d'attente
          await storageService.removePendingOperation(op.id);
        } catch (error) {
          console.error(`Error syncing operation ${op.id}:`, error);
          // On continue avec les autres opérations
        }
      }
    } catch (error) {
      console.error('Error syncing to server:', error);
    }
  },

  // Créer une note (offline-first)
  createNoteOffline: async (data: { title: string; contentMd: string; tags: string[] }): Promise<Note> => {
    const localId = `local_${Date.now()}`;
    const localNote: Note = {
      id: 0, // Sera remplacé par l'ID du serveur lors de la sync
      localId,
      title: data.title,
      contentMd: data.contentMd,
      tags: data.tags,
      visibility: 'PRIVATE',
      ownerId: 0,
      ownerEmail: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    // Sauvegarder localement
    await storageService.addOrUpdateNote(localNote);

    // Ajouter à la file d'opérations en attente
    const operation: PendingOperation = {
      id: localId,
      type: 'CREATE',
      localId,
      data,
      timestamp: Date.now(),
    };
    await storageService.addPendingOperation(operation);

    // Tenter de synchroniser immédiatement si en ligne
    syncService.syncToServer().catch(console.error);

    return localNote;
  },

  // Mettre à jour une note (offline-first)
  updateNoteOffline: async (id: number, data: any): Promise<Note> => {
    const existingNote = await storageService.getNoteById(id);
    if (!existingNote) {
      throw new Error('Note not found');
    }

    const updatedNote: Note = {
      ...existingNote,
      ...data,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    // Sauvegarder localement
    await storageService.addOrUpdateNote(updatedNote);

    // Ajouter à la file d'opérations en attente
    const operation: PendingOperation = {
      id: `update_${id}_${Date.now()}`,
      type: 'UPDATE',
      noteId: id,
      data,
      timestamp: Date.now(),
    };
    await storageService.addPendingOperation(operation);

    // Tenter de synchroniser immédiatement si en ligne
    syncService.syncToServer().catch(console.error);

    return updatedNote;
  },

  // Supprimer une note (offline-first)
  deleteNoteOffline: async (id: number): Promise<void> => {
    // Marquer comme en attente de suppression
    const existingNote = await storageService.getNoteById(id);
    if (existingNote) {
      await storageService.addOrUpdateNote({
        ...existingNote,
        pendingDelete: true,
      });
    }

    // Ajouter à la file d'opérations en attente
    const operation: PendingOperation = {
      id: `delete_${id}_${Date.now()}`,
      type: 'DELETE',
      noteId: id,
      data: {},
      timestamp: Date.now(),
    };
    await storageService.addPendingOperation(operation);

    // Tenter de synchroniser immédiatement si en ligne
    syncService.syncToServer().catch(console.error);
  },
};
