import { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary global pour attraper toutes les erreurs React non gérées
 * et rediriger vers une page d'erreur 500
 */
class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-city-950 via-city-900 to-city-950 flex items-center justify-center px-4">
          <div className="max-w-4xl w-full">
            <div
              className="relative bg-city-800 border-2 border-blood-600 rounded-lg p-8 md:p-12 shadow-2xl overflow-hidden"
              style={{
                backgroundImage: 'url(/errorIllustrations/error5xx.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="absolute inset-0 bg-city-900 bg-opacity-60 rounded-lg"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h1 className="text-6xl md:text-8xl font-titre-Jeu text-blood-500 mb-4 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                    500
                  </h1>
                </div>

                <h2 className="text-3xl md:text-4xl font-alternative-1 text-blood-400 text-center mb-6">
                  Erreur Interne
                </h2>

                <div className="bg-city-900 border-l-4 border-blood-600 p-6 rounded mb-8">
                  <p className="font-texte-corps text-city-300 text-lg leading-relaxed">
                    Une erreur inattendue s'est produite dans l'application. Nos équipes ont été notifiées.
                  </p>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-blood-400 font-bold">
                        Détails de l'erreur (dev only)
                      </summary>
                      <pre className="mt-2 text-xs text-city-400 overflow-auto">
                        {this.state.error.toString()}
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-city-700 hover:bg-city-600 text-blood-400 font-texte-corps rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    ↻ Recharger la page
                  </button>

                  <Link
                    to="/"
                    className="px-6 py-3 bg-blood-600 hover:bg-blood-500 text-white font-texte-corps text-center rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    🏠 Retour au Portail
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-city-700">
                  <p className="font-texte-corps text-city-500 text-sm text-center italic">
                    "Dans les Terres Désolées, même les systèmes les plus robustes peuvent flancher..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

GlobalErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalErrorBoundary;
