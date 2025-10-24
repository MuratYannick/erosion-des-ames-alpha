import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GlobalErrorBoundary from './GlobalErrorBoundary';

// Composant qui lance une erreur pour tester l'ErrorBoundary
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error from component');
  }
  return <div>No error</div>;
};

describe('GlobalErrorBoundary', () => {
  beforeEach(() => {
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when there is no error', () => {
    render(
      <BrowserRouter>
        <GlobalErrorBoundary>
          <div>Test content</div>
        </GlobalErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should display error page when an error is caught', () => {
    render(
      <BrowserRouter>
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Erreur Interne')).toBeInTheDocument();
    expect(screen.getByText(/Une erreur inattendue s'est produite/i)).toBeInTheDocument();
  });

  it('should display reload button', () => {
    render(
      <BrowserRouter>
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      </BrowserRouter>
    );

    const reloadButton = screen.getByText(/Recharger la page/i);
    expect(reloadButton).toBeInTheDocument();
  });

  it('should display home link', () => {
    render(
      <BrowserRouter>
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      </BrowserRouter>
    );

    const homeLink = screen.getByText(/Retour au Portail/i);
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should log error to console', () => {
    render(
      <BrowserRouter>
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      </BrowserRouter>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('should display thematic message', () => {
    render(
      <BrowserRouter>
        <GlobalErrorBoundary>
          <ThrowError shouldThrow={true} />
        </GlobalErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText(/Dans les Terres Désolées/i)).toBeInTheDocument();
  });
});
