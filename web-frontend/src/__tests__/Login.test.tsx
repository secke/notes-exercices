import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { useAuthStore } from '../store/authStore';

// Mock du store
vi.mock('../store/authStore');

describe('Login Component', () => {
  it('renders login form correctly', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn(),
      isLoading: false,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Adresse email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('calls login function on form submit', async () => {
    const mockLogin = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Adresse email');
    const passwordInput = screen.getByPlaceholderText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('disables submit button when loading', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn(),
      isLoading: true,
    } as any);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /connexion\.\.\./i });
    expect(submitButton).toBeDisabled();
  });
});