import { useState } from 'react';
import PortalLayout from '../../components/portal/layout/PortalLayout';

const Univers = () => {
  const [activeSection, setActiveSection] = useState('mise-en-situation');

  const navigationItems = [
    {
      id: 'mise-en-situation',
      title: 'Mise en situation',
      icon: '🔥',
    },
    {
      id: 'factions-clans',
      title: 'Les factions et ses clans',
      icon: '⚔️',
    },
    {
      id: 'survivre',
      title: 'Survivre dans ce monde cruel',
      icon: '🛡️',
    },
    {
      id: 'bestiaire',
      title: 'Le bestiaire',
      icon: '🐺',
    },
  ];

  return (
    <PortalLayout>
      <section className="bg-city-900">
        {/* Bannière avec image de fond - Titre et Sous-titre */}
        <div
          className="relative bg-cover bg-center bg-no-repeat py-20 md:py-32"
          style={{
            backgroundImage: 'url(/portalIlustrations/banner.png)',
          }}
        >
          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Titre */}
              <h1 className="text-4xl md:text-6xl font-titre-Jeu text-ochre-500 mb-6 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]">
                L'Univers
              </h1>

              {/* Sous-titre */}
              <p className="text-xl md:text-2xl font-alternative-1 text-ochre-300 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                Le lore d'un monde post-apocalyptique
              </p>
            </div>
          </div>
        </div>

        {/* Contenu sous la bannière */}
        <div className="bg-gradient-to-b from-city-900 via-city-950 to-city-900 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Introduction */}
              <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 mb-12 shadow-xl">
                <p className="font-texte-corps text-city-300 text-lg leading-relaxed text-center">
                  Plongez dans le lore d'<span className="text-ochre-500 font-bold">Érosion des Âmes</span>,
                  un monde post-apocalyptique où l'humanité lutte pour sa survie entre mutation et
                  préservation, dans les ruines d'une civilisation disparue.
                </p>
              </div>

              {/* Navigation des sections */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`p-6 rounded-lg font-texte-corps text-center transition-all transform hover:scale-105 ${
                      activeSection === item.id
                        ? 'bg-ochre-600 text-white shadow-xl border-2 border-ochre-500'
                        : 'bg-city-800 text-city-300 hover:bg-city-700 border-2 border-city-700'
                    }`}
                  >
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <span className="text-sm font-alternative-1">{item.title}</span>
                  </button>
                ))}
              </div>

              {/* Section Mise en situation */}
              {activeSection === 'mise-en-situation' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-8 text-center">
                    Quelque part, au milieu d'un petit village en ruine...
                  </h2>

                  {/* Partie 1 du texte */}
                  <div className="space-y-6 font-texte-corps text-city-300 leading-relaxed mb-8">
                    <p className="text-lg">
                      Dans un petit campement caché dans les ruines de ce qui fut un ancien village paisible,
                      quelques survivants d'un clan neutre se terrent autour d'un feu de camps. Tandis que les
                      flammes dansaient au son des braises qui crépitaient, les anciens du clan se rassemblèrent,
                      leurs visages burinés illuminés par la lumière vacillante. Leurs voix étaient douces et basses,
                      mais leurs paroles portaient un air de sagesse ancestrale et un sentiment d'appréhension.
                    </p>
                    <p className="text-lg">
                      « Le monde était autrefois un lieu de beauté et d'harmonie », commencèrent-ils. « Pourtant,
                      à cette époque reculée, l'humanité elle-même a semé le chaos... » Les jeunes auditeurs se
                      penchèrent en avant, intrigués par l'histoire, mais méfiants face à ses thèmes sombres.
                    </p>
                  </div>

                  {/* Image avec filtre sepia */}
                  <div className="mb-8 flex justify-center">
                    <img
                      src="/portalIlustrations/campFire.png"
                      alt="Feu de camp dans les ruines"
                      className="w-2/3 md:w-1/2 rounded-lg shadow-2xl sepia-[65%] hover:sepia-0 transition-all duration-[2500ms]"
                    />
                  </div>

                  {/* Partie 2 du texte */}
                  <div className="space-y-6 font-texte-corps text-city-300 leading-relaxed">
                    <p className="text-lg">
                      Les anciens poursuivirent leur récit :
                    </p>
                    <p className="text-lg">
                      « Les tensions montèrent alors que la planète luttait contre la surpopulation et le changement
                      climatique. Pour tenter de contrôler cette crise naissante, les gouvernements du monde entier
                      sombrèrent dans l'autoritarisme, promettant la sécurité en échange de l'abandon des libertés. »
                      L'atmosphère devint tendue tandis que les anciens décrivaient la transformation de la société.
                      « Les rivalités entre nations devinrent meurtrières à mesure que les ressources se raréfiaient.
                      Désespérés, certains pays cherchèrent à maintenir leur pouvoir en réprimant la dissidence. »
                    </p>
                    <p className="text-lg">
                      Leurs voix prirent un ton solennel tandis qu'ils évoquaient la brutalité de l'homme contre
                      l'homme. « Mais une nuit, une obscurité noire s'installa sur le pays. Un épais brouillard
                      sembla s'infiltrer dans les âmes des hommes comme des femmes. La folie commença. Dans une
                      soif de sang sans bornes, l'humanité se retourna contre elle-même. » En racontant cette
                      guerre fratricide, leurs yeux transpercèrent le cœur de ceux qui les écoutaient, les emplissant
                      d'un profond sentiment d'effroi.
                    </p>
                    <p className="text-lg">
                      « Après cela, il devint évident que le monde tel que nous le connaissions avait disparu.
                      Mutations et difformités apparurent dans la nature, tout comme chez les humains, jetant le
                      doute sur l'humanité de certains survivants. » Leurs voix s'alourdirent de tristesse tandis
                      qu'ils évoquaient les fractures de la société humaine. « Deux factions renaquirent de leurs
                      cendres : les mutants, nés du chaos, et les non-mutants, s'accrochant à leur prétendue pureté.
                      Ils se retournèrent les uns contre les autres, chacun accusant l'autre d'être responsable de
                      la fin du monde. »
                    </p>
                    <p className="text-lg">
                      En racontant ces paroles amères, il était clair que les anciens n'éprouvaient d'affection ni
                      pour l'un ni pour l'autre camp, ne voyant que la folie de l'humanité. « Le monde ne put jamais
                      guérir », poursuivirent-ils, leurs voix prenant un ton plein de désespoir. « Les mutants et
                      les non-mutants n'apprirent à coexister, qu'à de rares occasions. » Mais leur message n'était
                      pas entièrement porteur d'espoir. Les anciens évoquèrent les cicatrices qui subsistaient :
                      « Bien que nous, les clans neutres, ayons trouvé une paix fragile, nos blessures sont profondes.
                      Et à chaque génération, elles semblent se creuser davantage. » Avec ces derniers mots solennels,
                      le feu s'éteignit et les anciens se turent. Les jeunes auditeurs restèrent assis, méditant sur
                      l'histoire racontée et ses implications pour leur propre avenir.
                    </p>
                    <p className="text-lg">
                      À mesure que la nuit avançait, on pouvait les entendre chuchoter entre eux, discuter de la
                      nature de leur monde et se demander s'il y aurait un jour une fin au cycle de destruction
                      et de renouveau.
                    </p>
                  </div>
                </div>
              )}

              {/* Section Factions et Clans - Placeholder */}
              {activeSection === 'factions-clans' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                    Les factions et ses clans
                  </h2>
                  <p className="font-texte-corps text-city-400 text-center text-lg">
                    Section à compléter...
                  </p>
                </div>
              )}

              {/* Section Survivre - Placeholder */}
              {activeSection === 'survivre' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                    Survivre dans ce monde cruel
                  </h2>
                  <p className="font-texte-corps text-city-400 text-center text-lg">
                    Section à compléter...
                  </p>
                </div>
              )}

              {/* Section Bestiaire - Placeholder */}
              {activeSection === 'bestiaire' && (
                <div className="bg-city-800 border-2 border-ochre-600 rounded-lg p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-titre-Jeu text-ochre-500 mb-6 text-center">
                    Le bestiaire
                  </h2>
                  <p className="font-texte-corps text-city-400 text-center text-lg">
                    Section à compléter...
                  </p>
                </div>
              )}

              {/* Navigation vers autres pages */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/intro"
                  className="px-6 py-3 bg-city-700 hover:bg-city-600 text-ochre-400 font-texte-corps text-center rounded-lg transition-all"
                >
                  ← Retour à l'Introduction
                </a>
                <a
                  href="/reglement"
                  className="px-6 py-3 bg-ochre-600 hover:bg-ochre-500 text-white font-texte-corps text-center rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Règlement & CGU →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default Univers;
