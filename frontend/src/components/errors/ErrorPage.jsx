import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ErrorPage = ({
  errorCode,
  errorTitle,
  errorMessage,
  errorType = 'client', // 'client' (4xx), 'server' (5xx), 'network'
  showBackButton = true,
  showHomeButton = true
}) => {
  // Définir la couleur en fonction du type d'erreur
  const getErrorColor = () => {
    switch (errorType) {
      case 'client':
        return 'ochre'; // Erreurs client (4xx) - orange/ochre
      case 'server':
        return 'blood'; // Erreurs serveur (5xx) - rouge
      case 'network':
        return 'neutral'; // Erreurs réseau - gris
      default:
        return 'ochre';
    }
  };

  const errorColor = getErrorColor();

  // Icône en fonction du type d'erreur
  const getErrorIcon = () => {
    switch (errorType) {
      case 'client':
        return '🔒'; // Erreur client/accès
      case 'server':
        return '⚠️'; // Erreur serveur
      case 'network':
        return '📡'; // Erreur réseau
      default:
        return '❌';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-city-950 via-city-900 to-city-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Conteneur principal */}
        <div className={`bg-city-800 border-2 border-${errorColor}-600 rounded-lg p-8 md:p-12 shadow-2xl`}>

          {/* Icône et Code d'erreur */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">{getErrorIcon()}</div>
            {errorCode && (
              <h1 className={`text-6xl md:text-8xl font-titre-Jeu text-${errorColor}-500 mb-4 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]`}>
                {errorCode}
              </h1>
            )}
          </div>

          {/* Titre de l'erreur */}
          <h2 className={`text-3xl md:text-4xl font-alternative-1 text-${errorColor}-400 text-center mb-6`}>
            {errorTitle}
          </h2>

          {/* Message d'erreur */}
          <div className="bg-city-900 border-l-4 border-${errorColor}-600 p-6 rounded mb-8">
            <p className="font-texte-corps text-city-300 text-lg leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {showBackButton && (
              <button
                onClick={() => window.history.back()}
                className={`px-6 py-3 bg-city-700 hover:bg-city-600 text-${errorColor}-400 font-texte-corps rounded-lg transition-all transform hover:scale-105 shadow-lg`}
              >
                ← Retour
              </button>
            )}

            {showHomeButton && (
              <Link
                to="/"
                className={`px-6 py-3 bg-${errorColor}-600 hover:bg-${errorColor}-500 text-white font-texte-corps text-center rounded-lg transition-all transform hover:scale-105 shadow-lg`}
              >
                🏠 Retour au Portail
              </Link>
            )}
          </div>

          {/* Message additionnel thématique */}
          <div className="mt-8 pt-8 border-t border-city-700">
            <p className="font-texte-corps text-city-500 text-sm text-center italic">
              "Dans les Terres Désolées, même les chemins numériques peuvent mener nulle part..."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  errorCode: PropTypes.string,
  errorTitle: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired,
  errorType: PropTypes.oneOf(['client', 'server', 'network']),
  showBackButton: PropTypes.bool,
  showHomeButton: PropTypes.bool,
};

export default ErrorPage;
