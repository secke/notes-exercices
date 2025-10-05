import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { useAuthStore } from '../store/authStore';
import { useNotesStore } from '../store/notesStore';

vi.mock('../store/authStore');
vi.mock('../store/notesStore');

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: 1, email: 'test@example.com', createdAt: '2024-01-01' },
      logout: vi.fn(),
    } as any);
  });

  it('renders dashboard with user email', () => {
    vi.mocked(useNotesStore).mockReturnValue({
      notes: [],
      fetchNotes: vi.fn(),
      isLoading: false,
      searchQuery: '',
      selectedVisibility: '',
      setSearchQuery: vi.fn(),
      setSelectedVisibility: vi.fn(),
      clearFilters: vi.fn(),
      currentPage: 0,
      totalPages: 0,
    } as any);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Mes Notes')).toBeInTheDocument();
  });

  it('displays notes when available', () => {
    const mockNotes = [
      {
        id: 1,
        title: 'Test Note',
        visibility: 'PRIVATE',
        tags: ['test'],
        ownerEmail: 'test@example.com',
        updatedAt: '2024-01-01T12:00:00',
      },
    ];

    vi.mocked(useNotesStore).mockReturnValue({
      notes: mockNotes,
      fetchNotes: vi.fn(),
      deleteNote: vi.fn(),
      isLoading: false,
      searchQuery: '',
      selectedVisibility: '',
      setSearchQuery: vi.fn(),
      setSelectedVisibility: vi.fn(),
      clearFilters: vi.fn(),
      currentPage: 0,
      totalPages: 1,
    } as any);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText('Privé')).toBeInTheDocument();
  });

  it('shows empty state when no notes', () => {
    vi.mocked(useNotesStore).mockReturnValue({
      notes: [],
      fetchNotes: vi.fn(),
      isLoading: false,
      searchQuery: '',
      selectedVisibility: '',
      setSearchQuery: vi.fn(),
      setSelectedVisibility: vi.fn(),
      clearFilters: vi.fn(),
      currentPage: 0,
      totalPages: 0,
    } as any);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText('Aucune note')).toBeInTheDocument();
  });
});