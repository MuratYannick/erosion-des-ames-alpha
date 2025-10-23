import ErrorPage from '../../components/errors/ErrorPage';

const Unauthorized401 = () => {
  return (
    <ErrorPage
      errorCode="401"
      errorTitle="Authentification requise"
      errorMessage="Vous devez être authentifié pour accéder à cette zone. Les Terres Désolées ne laissent pas passer les inconnus sans identification. Veuillez vous connecter pour continuer."
      errorType="client"
      showBackButton={false}
      showHomeButton={true}
    />
  );
};

export default Unauthorized401;
