import { Link } from 'react-router-dom';
import { useAuth } from '../../core/hooks/useAuth';
import { Button, Card } from '../../components/ui';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Un monde en perdition',
      description:
        "Plongez dans un univers sombre ou les ames s'effritent peu a peu. Chaque choix compte, chaque action laisse une trace indelebile.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Communaute vivante',
      description:
        'Rejoignez un forum actif ou joueurs et maitres de jeu partagent leurs experiences, theories et creations.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Systeme de jeu unique',
      description:
        "Un systeme de regles innovant qui met l'accent sur la narration et les consequences morales de vos actions.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
    },
    {
      title: 'Progression persistante',
      description:
        'Vos personnages evoluent au fil des sessions, gardant les cicatrices et les triomphes de leurs aventures.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900" />

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Erosion des Ames
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Un jeu de role narratif ou chaque ame porte le poids de ses choix. Plongez dans un
            univers sombre et captivant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/game">
                <Button variant="primary" size="lg">
                  Commencer l'aventure
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Commencer l'aventure
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Se connecter
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Decouvrez un univers <span className="text-purple-400">unique</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Erosion des Ames offre une experience de jeu de role immersive, ou chaque decision
              faconne le destin de votre personnage et du monde qui l'entoure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:border-purple-500/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-lg flex items-center justify-center text-purple-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-gray-900 to-amber-900/20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pret a affronter <span className="text-amber-400">l'erosion</span> ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communaute de joueurs et creez votre propre legende dans un monde ou
            chaque ame compte.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="secondary" size="lg">
                  Creer un compte gratuit
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  En savoir plus
                </Button>
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <Link to="/about">
              <Button variant="secondary" size="lg">
                Decouvrir le projet
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/30 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400">100+</div>
              <div className="text-gray-400 mt-1">Joueurs actifs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">50+</div>
              <div className="text-gray-400 mt-1">Parties en cours</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-400">1000+</div>
              <div className="text-gray-400 mt-1">Messages forum</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">24/7</div>
              <div className="text-gray-400 mt-1">Communaute active</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
