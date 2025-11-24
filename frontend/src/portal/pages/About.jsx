import { Card } from '../../components/ui';

const About = () => {
  const technologies = [
    { name: 'React', category: 'Frontend', color: 'text-cyan-400' },
    { name: 'Vite', category: 'Build Tool', color: 'text-purple-400' },
    { name: 'TailwindCSS', category: 'Styling', color: 'text-teal-400' },
    { name: 'Node.js', category: 'Backend', color: 'text-green-400' },
    { name: 'Express', category: 'API', color: 'text-gray-400' },
    { name: 'MySQL', category: 'Database', color: 'text-blue-400' },
    { name: 'Sequelize', category: 'ORM', color: 'text-amber-400' },
    { name: 'JWT', category: 'Auth', color: 'text-red-400' },
  ];

  const timeline = [
    {
      phase: 'Phase 1',
      title: 'Fondations',
      description: "Mise en place de l'infrastructure, authentification, et portail principal.",
      status: 'completed',
    },
    {
      phase: 'Phase 2',
      title: 'Forum communautaire',
      description: 'Systeme de discussion, categories, et moderation.',
      status: 'in-progress',
    },
    {
      phase: 'Phase 3',
      title: 'Systeme de jeu',
      description: 'Creation de personnages, gestion des parties, et regles du jeu.',
      status: 'planned',
    },
    {
      phase: 'Phase 4',
      title: 'Fonctionnalites avancees',
      description: 'Systeme de quetes, evenements, et enrichissement du lore.',
      status: 'planned',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-400 border-green-500/50',
      'in-progress': 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      planned: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
    };
    const labels = {
      completed: 'Termine',
      'in-progress': 'En cours',
      planned: 'Planifie',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="text-white py-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          A propos d'<span className="text-purple-400">Erosion des Ames</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Un projet ambitieux combinant jeu de role narratif et plateforme communautaire, cree par
          des passionnes pour des passionnes.
        </p>
      </section>

      {/* Project Description */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Le Projet</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-purple-400">Erosion des Ames</strong> est une plateforme web
                complete dediee a un jeu de role narratif original. Notre objectif est de creer un
                espace ou les joueurs peuvent vivre des aventures immersives tout en faisant partie
                d'une communaute active.
              </p>
              <p>
                Le projet se compose de trois modules principaux : un <strong>portail</strong>{' '}
                d'accueil et d'information, un <strong>forum</strong> communautaire pour les
                echanges entre joueurs, et le <strong>jeu</strong> lui-meme avec son systeme de
                regles unique.
              </p>
              <p>
                L'univers d'Erosion des Ames explore des themes sombres et matures, ou les
                personnages font face a des dilemmes moraux et ou chaque choix a des consequences
                durables sur leur ame et le monde qui les entoure.
              </p>
            </div>
          </Card>

          <Card className="h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Notre Vision</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Nous croyons que les meilleurs jeux de role sont ceux qui privilégient la narration
                et les interactions entre joueurs plutot que les mecaniques complexes.
              </p>
              <p>
                Notre systeme de jeu est concu pour etre <strong>accessible</strong> aux debutants
                tout en offrant une <strong>profondeur</strong> suffisante pour satisfaire les
                joueurs experimentes.
              </p>
              <p>
                La plateforme est pensee pour faciliter l'organisation de parties en ligne, avec des
                outils dedies pour les maitres de jeu et les joueurs : gestion de fiches de
                personnages, lancers de des, journaux de partie, et plus encore.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Feuille de <span className="text-amber-400">route</span>
        </h2>
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="relative pl-8 border-l-2 border-gray-700 hover:border-purple-500 transition-colors"
            >
              <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-gray-900 border-2 border-purple-500" />
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-purple-400">{item.phase}</span>
                {getStatusBadge(item.status)}
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Technologies <span className="text-purple-400">utilisees</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {technologies.map((tech, index) => (
            <Card key={index} className="text-center hover:border-purple-500/50 transition-colors">
              <div className={`text-lg font-semibold ${tech.color}`}>{tech.name}</div>
              <div className="text-sm text-gray-500">{tech.category}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Rejoignez l'aventure</h2>
          <p className="text-gray-300 mb-6">
            Erosion des Ames est un projet en constante evolution. Nous sommes toujours a la
            recherche de retours, de suggestions, et de passionnes pour enrichir notre communaute.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/MuratYannick/erosion-des-ames"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
            <a
              href="mailto:contact@erosion-des-ames.fr"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default About;
