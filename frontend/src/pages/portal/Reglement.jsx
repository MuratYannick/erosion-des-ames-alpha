import PortalLayout from '../../components/portal/layout/PortalLayout';

const Reglement = () => {
  const rules = [
    {
      title: 'Respect et Fair-Play',
      items: [
        'Traitez tous les joueurs avec respect',
        'Pas de harcèlement, discrimination ou insultes',
        'Le fair-play est obligatoire en PvP comme en PvE',
        'Les comportements toxiques seront sanctionnés',
      ],
    },
    {
      title: 'Communication',
      items: [
        'Pas de spam dans le chat global',
        'Utilisez le canal approprié pour chaque type de message',
        'Pas de publicité ou de contenu commercial non autorisé',
        'La langue principale du serveur est le français',
      ],
    },
    {
      title: 'Gameplay',
      items: [
        'Aucune triche, hack ou bot toléré',
        'Pas d\'exploitation de bugs (signaler au staff)',
        'Le multi-compte est limité à 2 comptes par joueur',
        'Respectez les zones PvP/PvE désignées',
      ],
    },
    {
      title: 'Sanctions',
      items: [
        'Avertissement pour les infractions mineures',
        'Mute temporaire pour spam ou langage inapproprié',
        'Ban temporaire pour triche ou exploitation',
        'Ban permanent pour infractions graves répétées',
      ],
    },
  ];

  return (
    <PortalLayout>
      <section className="bg-gradient-to-b from-city-900 via-city-950 to-city-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Titre */}
            <h1 className="text-4xl md:text-6xl font-titre-Jeu text-ochre-500 text-center mb-8">
              Règlement & CGU
            </h1>

            {/* Introduction */}
            <div className="bg-blood-900 border-2 border-blood-700 rounded-lg p-6 mb-12 shadow-xl">
              <p className="font-texte-corps text-blood-200 text-center">
                ⚠️ En jouant à Érosion des Âmes, vous acceptez de respecter les règles suivantes.
                Le non-respect de ces règles peut entraîner des sanctions pouvant aller jusqu'au
                bannissement permanent.
              </p>
            </div>

            {/* Règles */}
            <div className="space-y-8 mb-12">
              {rules.map((section, index) => (
                <div
                  key={index}
                  className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 shadow-xl"
                >
                  <h2 className="text-2xl font-alternative-1 text-ochre-500 mb-6">
                    {index + 1}. {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start font-texte-corps text-city-300"
                      >
                        <span className="text-ochre-500 mr-3 mt-1">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Conditions Générales d'Utilisation */}
            <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
              <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                Conditions Générales d'Utilisation
              </h2>

              <div className="space-y-6 font-texte-corps text-city-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-alternative-1 text-ochre-400 mb-3">
                    1. Acceptation des Conditions
                  </h3>
                  <p>
                    En créant un compte et en utilisant Érosion des Âmes, vous acceptez d'être lié
                    par ces Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions,
                    veuillez ne pas utiliser le jeu.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-alternative-1 text-ochre-400 mb-3">
                    2. Statut Alpha
                  </h3>
                  <p>
                    Le jeu est actuellement en version <span className="text-blood-400 font-bold">ALPHA</span>.
                    Cela signifie que des bugs, des pertes de progression, et des modifications
                    majeures peuvent survenir. Nous ne garantissons pas la stabilité du service
                    pendant cette phase de développement.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-alternative-1 text-ochre-400 mb-3">
                    3. Données Personnelles
                  </h3>
                  <p>
                    Nous collectons uniquement les données nécessaires au fonctionnement du jeu
                    (email, nom d'utilisateur, données de jeu). Ces données ne seront jamais
                    vendues ou partagées avec des tiers. Vous pouvez demander la suppression
                    de votre compte à tout moment.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-alternative-1 text-ochre-400 mb-3">
                    4. Propriété Intellectuelle
                  </h3>
                  <p>
                    Tout le contenu du jeu (graphismes, textes, code, concept) est la propriété
                    exclusive d'Érosion des Âmes. Toute reproduction ou utilisation non autorisée
                    est interdite.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-alternative-1 text-ochre-400 mb-3">
                    5. Responsabilité
                  </h3>
                  <p>
                    Le jeu est fourni "tel quel" sans garantie d'aucune sorte. Nous ne sommes pas
                    responsables des dommages directs ou indirects résultant de l'utilisation du jeu.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-alternative-1 text-ochre-400 mb-3">
                    6. Modifications
                  </h3>
                  <p>
                    Nous nous réservons le droit de modifier ces CGU à tout moment. Les utilisateurs
                    seront informés des changements majeurs. L'utilisation continue du jeu après
                    modification vaut acceptation des nouvelles conditions.
                  </p>
                </div>

                <div className="border-t-2 border-city-700 pt-6 mt-8">
                  <p className="text-sm text-city-500 text-center">
                    Dernière mise à jour : 23 Octobre 2025 - Version Alpha 0.1.0
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-12 bg-city-800 border-2 border-nature-600 rounded-lg p-6 text-center">
              <h3 className="text-xl font-alternative-1 text-nature-400 mb-3">
                Besoin d'aide ou de clarifications ?
              </h3>
              <p className="font-texte-corps text-city-300 mb-4">
                Contactez l'équipe de modération sur le forum ou par email
              </p>
              <a
                href="/forum"
                className="inline-block px-6 py-3 bg-nature-600 hover:bg-nature-500 text-white font-texte-corps rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Aller au Forum
              </a>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/univers"
                className="px-6 py-3 bg-city-700 hover:bg-city-600 text-ochre-400 font-texte-corps text-center rounded-lg transition-all"
              >
                ← Retour à l'Univers
              </a>
              <a
                href="/"
                className="px-6 py-3 bg-ochre-600 hover:bg-ochre-500 text-white font-texte-corps text-center rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Retour à l'Accueil
              </a>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Reglement;
