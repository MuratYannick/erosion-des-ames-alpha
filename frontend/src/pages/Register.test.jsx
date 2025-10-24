import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import * as api from '../services/api';

// Mock des modules
vi.mock('../services/api');
vi.mock('../utils/localStorage', () => ({
  storage: {
    setToken: vi.fn(),
    setUser: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render register form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText('Inscription')).toBeInTheDocument();
    expect(screen.getByLabelText(/nom d'utilisateur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/mot de passe/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('should display error for password mismatch', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'differentpassword');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
    });
  });

  it('should display error for short password', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], '123');
    await user.type(passwordFields[1], '123');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText(/au moins 6 caractères/i)).toBeInTheDocument();
    });
  });

  it('should display error message for 409 conflict (username taken)', async () => {
    const user = userEvent.setup();
    const error = {
      response: { status: 409 },
      message: 'Ce nom d\'utilisateur est déjà pris',
    };

    api.authService.register.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'existinguser');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText('Ce nom d\'utilisateur est déjà pris')).toBeInTheDocument();
    });
  });

  it('should redirect for 500 server errors', async () => {
    const user = userEvent.setup();
    const error = {
      response: { status: 500 },
      message: 'Internal Server Error',
    };

    api.authService.register.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error/500');
    });
  });

  it('should redirect for network errors', async () => {
    const user = userEvent.setup();
    const error = new Error('Failed to fetch');

    api.authService.register.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error/network');
    });
  });

  it('should clear error message when user types', async () => {
    const user = userEvent.setup();
    const error = {
      response: { status: 409 },
      message: 'Ce nom d\'utilisateur est déjà pris',
    };

    api.authService.register.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // Provoquer une erreur
    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'taken');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText('Ce nom d\'utilisateur est déjà pris')).toBeInTheDocument();
    });

    // Taper dans le champ devrait effacer l'erreur
    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'x');

    await waitFor(() => {
      expect(screen.queryByText('Ce nom d\'utilisateur est déjà pris')).not.toBeInTheDocument();
    });
  });

  it('should navigate to home on successful registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'fake-token',
      user: { id: 1, email: 'test@test.com', username: 'testuser' },
    };

    api.authService.register.mockResolvedValue(mockResponse);

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'newuser');
    await user.type(screen.getByLabelText(/^email$/i), 'new@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');
    await user.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show loading state during registration', async () => {
    const user = userEvent.setup();
    api.authService.register.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    expect(submitButton).not.toBeDisabled();

    await user.type(screen.getByLabelText(/nom d'utilisateur/i), 'testuser');
    await user.type(screen.getByLabelText(/^email$/i), 'test@test.com');
    const passwordFields = screen.getAllByLabelText(/mot de passe/i);
    await user.type(passwordFields[0], 'password123');
    await user.type(passwordFields[1], 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /inscription\.\.\./i })).toBeDisabled();
    });
  });

  it('should have link to login page', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const loginLink = screen.getByText(/se connecter/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should display password requirement hint', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByText(/minimum 6 caractères/i)).toBeInTheDocument();
  });
});
