import ErrorPage from '../../components/errors/ErrorPage';

const NotFound404 = () => {
  return (
    <ErrorPage
      errorCode="404"
      errorTitle="Page introuvable"
      errorMessage="La page que vous recherchez n'existe pas ou a été déplacée. Dans les Terres Désolées, certains chemins mènent nulle part. Retournez sur vos pas ou regagnez le Portail."
      errorType="client"
    />
  );
};

export default NotFound404;
