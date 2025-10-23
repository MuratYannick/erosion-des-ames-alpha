import ErrorPage from '../../components/errors/ErrorPage';

const ServiceUnavailable503 = () => {
  return (
    <ErrorPage
      errorCode="503"
      errorTitle="Service temporairement indisponible"
      errorMessage="Le service est actuellement indisponible en raison d'une maintenance ou d'une surcharge. Les communications avec l'avant-poste sont momentanément interrompues. Veuillez réessayer dans quelques minutes."
      errorType="server"
      showBackButton={false}
    />
  );
};

export default ServiceUnavailable503;
