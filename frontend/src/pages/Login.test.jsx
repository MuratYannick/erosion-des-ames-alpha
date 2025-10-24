import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
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

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('should display error message for 401 authentication errors', async () => {
    const user = userEvent.setup();
    const error = {
      response: { status: 401 },
      message: 'Email ou mot de passe incorrect',
    };

    api.authService.login.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });
  });

  it('should redirect for 500 server errors', async () => {
    const user = userEvent.setup();
    const error = {
      response: { status: 500 },
      message: 'Internal Server Error',
    };

    api.authService.login.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'password');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error/500');
    });
  });

  it('should redirect for network errors', async () => {
    const user = userEvent.setup();
    const error = new Error('Failed to fetch');

    api.authService.login.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'password');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/error/network');
    });
  });

  it('should clear error message when user types', async () => {
    const user = userEvent.setup();
    const error = {
      response: { status: 401 },
      message: 'Email ou mot de passe incorrect',
    };

    api.authService.login.mockRejectedValue(error);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Provoquer une erreur
    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText('Email ou mot de passe incorrect')).toBeInTheDocument();
    });

    // Taper dans le champ devrait effacer l'erreur
    await user.type(screen.getByLabelText(/email/i), 'x');

    await waitFor(() => {
      expect(screen.queryByText('Email ou mot de passe incorrect')).not.toBeInTheDocument();
    });
  });

  it('should navigate to home on successful login', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      token: 'fake-token',
      user: { id: 1, email: 'test@test.com', username: 'testuser' },
    };

    api.authService.login.mockResolvedValue(mockResponse);

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'password123');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should show loading state during login', async () => {
    const user = userEvent.setup();
    api.authService.login.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /se connecter/i });
    expect(submitButton).not.toBeDisabled();

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/mot de passe/i), 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /connexion\.\.\./i })).toBeDisabled();
    });
  });

  it('should have link to register page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const registerLink = screen.getByText(/s'inscrire/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});
