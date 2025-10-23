import ErrorPage from '../../components/errors/ErrorPage';

const ServerError500 = () => {
  return (
    <ErrorPage
      errorCode="500"
      errorTitle="Erreur interne du serveur"
      errorMessage="Une erreur s'est produite sur nos serveurs. Les systèmes de l'avant-poste semblent défaillants. Nos techniciens travaillent à rétablir la connexion. Veuillez réessayer dans quelques instants."
      errorType="server"
    />
  );
};

export default ServerError500;
