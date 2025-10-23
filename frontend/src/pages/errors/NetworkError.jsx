import ErrorPage from '../../components/errors/ErrorPage';

const NetworkError = () => {
  return (
    <ErrorPage
      errorTitle="Erreur de connexion réseau"
      errorMessage="Impossible de se connecter au serveur. Vérifiez votre connexion internet ou le serveur est peut-être hors ligne. Les communications avec l'avant-poste sont coupées. Tentez de rétablir la connexion et réessayez."
      errorType="network"
      showBackButton={false}
    />
  );
};

export default NetworkError;
