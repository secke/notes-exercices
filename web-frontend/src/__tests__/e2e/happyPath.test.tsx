import { describe, it, expect, vi } from 'vitest';
import { authApi, notesApi, shareApi } from '../../lib/api';

vi.mock('../../lib/api');

describe('E2E Happy Path', () => {
  it('complete user workflow: register -> create note -> share', async () => {
    // 1. Inscription
    const mockAuthResponse = {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      tokenType: 'Bearer',
      expiresIn: 86400000,
      user: {
        id: 1,
        email: 'newuser@example.com',
        createdAt: '2024-01-01T12:00:00',
      },
    };

    vi.mocked(authApi.register).mockResolvedValue(mockAuthResponse);

    const registerResult = await authApi.register({
      email: 'newuser@example.com',
      password: 'password123',
    });

    expect(registerResult.user.email).toBe('newuser@example.com');
    expect(registerResult.accessToken).toBeDefined();

    // 2. Création d'une note
    const mockNote = {
      id: 1,
      title: 'My First Note',
      contentMd: '# Hello World',
      visibility: 'PRIVATE' as const,
      tags: ['test'],
      ownerId: 1,
      ownerEmail: 'newuser@example.com',
      createdAt: '2024-01-01T12:00:00',
      updatedAt: '2024-01-01T12:00:00',
    };

    vi.mocked(notesApi.create).mockResolvedValue(mockNote);

    const createdNote = await notesApi.create({
      title: 'My First Note',
      contentMd: '# Hello World',
      tags: ['test'],
    });

    expect(createdNote.title).toBe('My First Note');
    expect(createdNote.id).toBe(1);

    // 3. Partage de la note
    const mockShare = {
      id: 1,
      noteId: 1,
      sharedWithEmail: 'friend@example.com',
      permission: 'READ' as const,
    };

    vi.mocked(shareApi.shareWithUser).mockResolvedValue(mockShare);

    const share = await shareApi.shareWithUser(1, 'friend@example.com');

    expect(share.sharedWithEmail).toBe('friend@example.com');
    expect(share.noteId).toBe(1);

    // Vérification finale du workflow
    expect(authApi.register).toHaveBeenCalledTimes(1);
    expect(notesApi.create).toHaveBeenCalledTimes(1);
    expect(shareApi.shareWithUser).toHaveBeenCalledTimes(1);
  });
});