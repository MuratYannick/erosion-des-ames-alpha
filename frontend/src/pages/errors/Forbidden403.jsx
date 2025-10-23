import ErrorPage from '../../components/errors/ErrorPage';

const Forbidden403 = () => {
  return (
    <ErrorPage
      errorCode="403"
      errorTitle="Accès interdit"
      errorMessage="Vous n'avez pas l'autorisation d'accéder à cette ressource. Les portes de cette zone sont verrouillées pour vous. Contactez les gardiens si vous pensez qu'il s'agit d'une erreur."
      errorType="client"
    />
  );
};

export default Forbidden403;
