'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('clans', [
      // ==========================================
      // FACTION 1: LES ÉCLAIREURS DE L'AUBE NOUVELLE
      // ==========================================

      // Clan Leader (non jouable)
      {
        id: 1,
        name: 'Les Prophètes de l\'Harmonie',
        description: 'L\'Ordre Supérieur des Éclaireurs. Un chef religieux (souvent un mutant herboriste/guérisseur se prétendant des capacités spirituelles chamanique) et ses principaux disciples, des mutants fanatiques qui le suivent dans une foi aveugle. Ils guident la faction dans sa compréhension et son acceptation de la mutation comme une voie d\'évolution. Ils interprètent les signes du monde nouveau, maintiennent la cohésion spirituelle de l\'avant-poste, et définissent la "volonté des mutations". Ils sont les intercesseurs entre le monde muté et les vivants, souvent considérés comme les plus proches de l\'essence du "Chaos" dont ils sont nés.',
        faction_id: 1, // Les Éclaireurs de l'Aube Nouvelle
        ethnie_id: 1, // Exclusif aux Éveillés
        is_playable: false,
        leader_character_id: null,
        leader_name: null, // À définir
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clans Secondaires Jouables
      {
        id: 2,
        name: 'La Caste des Symbiotes',
        description: 'Ressources & Adaptation. Ce clan regroupe des mutants ayant développé une connexion presque intuitive avec la nature environnante, leur permettant de comprendre et de manipuler les écosystèmes mutés pour le bien de leur communauté. Leur expertise réside dans la symbiose, l\'exploitation des ressources de la nature et l\'adaptation de leur avant-poste à leur environnement. Ils assurent la survivance matérielle de l\'avant-poste en exploitant les ressources du monde muté, développent des techniques uniques de culture, de purification de l\'eau, ou de recyclage basées sur la nature, construisent et adaptent les structures de l\'avant-poste en utilisant des matériaux et des méthodes non conventionnels, et recherchent de nouvelles formes de vie ou de substances utiles issues des mutations de l\'environnement.',
        faction_id: 1,
        ethnie_id: 1,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 3,
        name: 'La Caste des Sensitifs',
        description: 'Exploration & Perception. Les Sensitifs sont des mutants dont les sens sont particulièrement aiguisés, leur permettant de percevoir leur environnement de manière unique et d\'anticiper les dangers ou de déceler des opportunités là où d\'autres ne verraient rien. Ils servent de sentinelles naturelles et de guides infaillibles, capables de naviguer dans le monde transformé avec une grande intuition. Ils explorent les territoires inconnus et "lisent" le monde extérieur grâce à la connaissance de leur environnement, détectent la moindre ressource cachée et traquent tout genre de proies ou de menaces, et servent d\'éclaireurs et de guides pour les expéditions.',
        faction_id: 1,
        ethnie_id: 1,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 4,
        name: 'La Caste des Forgerons de Chair',
        description: 'Guérison & Évolution. Ce sont les "médecins" et les "biologistes" des mutants. Possédant une connaissance approfondie de la nature sous toutes ses formes, ils sont capables d\'utiliser les propriétés des espèces vivantes, qu\'il s\'agisse de flore ou de faune mutées, pour soigner, empoisonner ou nourrir leur communauté. Leur pratique, bien que considérée comme barbare par les non-mutants, est d\'une efficacité redoutable et repose sur une compréhension intime des mutations et des nouvelles formes de vie. Ils soignent les blessures et les maladies, étudient et connaissent l\'ensemble des espèces vivantes afin d\'en tirer le meilleur profit, et développent des antidotes comme des poisons redoutables.',
        faction_id: 1,
        ethnie_id: 1,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 5,
        name: 'La Caste des Sentinelles du Chaos',
        description: 'Défense & Confrontation. Regroupant des mutants dont les capacités physiques et l\'agilité ont été exacerbées par le cataclysme, ce clan forme l\'avant-garde martiale de la faction. Ils sont les gardiens de l\'avant-poste, spécialisés dans le combat contre les menaces extérieures, qu\'il s\'agisse des non-mutants ou des créatures hostiles du monde sauvage. Leur force est mise au service de la survie de la faction et de l\'avancement de sa cause. Ils assurent la défense active de l\'avant-poste, mènent les affrontements contre les non-mutants et les créatures hostiles, et développent des tactiques de combat lors des expéditions extérieures.',
        faction_id: 1,
        ethnie_id: 1,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 6,
        name: 'La Caste des Scrutateurs',
        description: 'Connaissance & Mystères du passé. Des mutants dont les capacités ou les obsessions les poussent à fouiller les ruines de l\'ancien monde, non pas pour le préserver, mais pour en comprendre la chute et en extraire des éléments utiles ou des avertissements. Ils récupèrent des artefacts et des informations des ruines de l\'Ancien Monde, analysent les causes de la "folie" et de la destruction passée, empêchent que des technologies ou des connaissances oubliées qui pourraient servir la faction ennemie ne tombent entre leurs mains, et servent de rappel constant des erreurs commises par l\'humanité "non-altérée".',
        faction_id: 1,
        ethnie_id: 1,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // FACTION 2: LES VEILLEURS DE L'ANCIEN MONDE
      // ==========================================

      // Clan Leader (non jouable)
      {
        id: 7,
        name: 'Les Élus d\'Avant',
        description: 'Le Clan Supérieur des Veilleurs. Le chef de l\'avant-poste et ses conseillers les plus proches. Ils assurent la gouvernance globale de l\'avant-poste et sont les dépositaires ultimes de l\'héritage de l\'Ancien Monde. Ils prennent les décisions stratégiques, définissent les lois, arbitrent les conflits majeurs entre clans, et maintiennent la "pureté" idéologique et génétique de la faction. Ils incarnent l\'autorité et la sagesse ancestrale.',
        faction_id: 2, // Les Veilleurs de l'Ancien Monde
        ethnie_id: 2, // Exclusif aux Inaltérés
        is_playable: false,
        leader_character_id: null,
        leader_name: null, // À définir
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // Clans Secondaires Jouables
      {
        id: 8,
        name: 'Le Clan des Sentinelles',
        description: 'Défense & Ordre. Le bras armé de la faction, ce clan regroupe les guerriers les plus aguerris, chargés de la défense de l\'avant-poste et du maintien de l\'ordre interne. Ils patrouillent les alentours, sécurisent les voies d\'accès et mènent les expéditions de reconnaissance et de combat pour garantir la sécurité et la pureté de la communauté. Ils assurent la défense de l\'avant-poste contre toute menace extérieure (mutants, créatures, autres factions), patrouillent les alentours et sécurisent les voies d\'accès, maintiennent l\'ordre interne et font respecter les lois établies par les Élus d\'Avant, et organisent les expéditions de reconnaissance et de combat.',
        faction_id: 2,
        ethnie_id: 2,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 9,
        name: 'Le Clan des Pourvoyeurs',
        description: 'Ressources & Production. Les membres de ce clan sont les garants de la survie matérielle de la communauté. Responsables de la collecte des ressources essentielles et de leur production, ils gèrent les infrastructures vitales de l\'avant-poste et s\'assurent que chaque clan est approvisionné selon ses besoins. Ils gèrent la collecte et la production de ressources essentielles (eau, nourriture, matériaux de construction, combustibles), entretiennent les infrastructures vitales de l\'avant-poste (purificateurs d\'eau, cultures, ateliers), développent des méthodes de production durables et efficaces, et approvisionnent les autres clans en fonction de leurs besoins.',
        faction_id: 2,
        ethnie_id: 2,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 10,
        name: 'Le Clan des Archivistes',
        description: 'Savoir & Tradition. Ce clan est le gardien de l\'héritage de l\'Ancien Monde. Composé d\'érudits et d\'anciens à la mémoire vive, ils préservent et étudient les reliques, les écrits et les récits du passé, transmettant les connaissances et les valeurs aux jeunes générations pour garantir que l\'humanité ne perde pas ses racines. Ils préservent et étudient les reliques, les écrits et les récits de l\'Ancien Monde, transmettent la connaissance, l\'histoire et les valeurs aux jeunes générations, documentent les événements actuels et les découvertes importantes, et servent de conseillers culturels et historiques aux Élus d\'Avant.',
        faction_id: 2,
        ethnie_id: 2,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 11,
        name: 'Le Clan des Purificateurs',
        description: 'Santé & Hygiène. Spécialistes de la santé et de l\'hygiène, les Purificateurs veillent à la "pureté" biologique du clan. Ils fournissent les soins médicaux, traitent les blessures et les maladies, et surveillent la population pour détecter tout signe de mutation ou de contamination. Ils recherchent activement des remèdes pour contrer les effets du monde muté. Ils fournissent les soins médicaux et traitent les blessures et maladies, veillent à l\'hygiène de l\'avant-poste et à la qualité de l\'eau et de la nourriture, surveillent les signes de mutation ou de contamination au sein de la population non-mutante et prennent des mesures préventives ou d\'isolement si nécessaire, et recherchent des remèdes et des moyens de contrer les effets du monde muté.',
        faction_id: 2,
        ethnie_id: 2,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 12,
        name: 'Le Clan des Explorateurs',
        description: 'Reconnaissance & Découverte. Ceux qui ont le courage de s\'aventurer au-delà des murs de l\'avant-poste, les Explorateurs sont les cartographes et les éclaireurs de la faction. Ils partent à la recherche de nouvelles ressources et d\'anciens artefacts utiles. En cartographiant les terres inconnues et en rapportant des informations vitales, ils aident à identifier les zones sûres ou dangereuses. Ils sont également chargés d\'établir, ou d\'éviter, le contact avec d\'autres groupes ou factions. Ils cartographient les terres inconnues et identifient les zones sûres ou dangereuses, recherchent de nouvelles ressources ou d\'anciens artefacts utiles, établissent le contact (ou évitent) avec d\'autres groupes ou factions, et rapportent des informations vitales sur l\'environnement extérieur et les menaces potentielles.',
        faction_id: 2,
        ethnie_id: 2,
        is_playable: true,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },

      // ==========================================
      // CLANS NEUTRES (non jouables pour le moment)
      // ==========================================

      {
        id: 13,
        name: 'Les Veilleurs des Ruines',
        description: 'Majoritairement non-mutants, parfois quelques mutants érudits. Vêtus de tenues pratiques pour l\'exploration, souvent équipés de lanternes et d\'outils de déblaiement. Ils sont calmes et méthodiques. Ils cartographient, explorent et sauvegardent les connaissances et artefacts des ruines de l\'Ancien Monde, non pas pour les glorifier, mais pour apprendre des erreurs passées et comprendre la catastrophe. Ils croient que la vérité est la seule voie vers un avenir meilleur. Très attachés à l\'impartialité et à l\'accumulation du savoir, ils refusent de prendre parti et partagent leurs découvertes avec quiconque est prêt à les écouter et à ne pas les détruire.',
        faction_id: null, // Clan neutre
        ethnie_id: null, // Clan mixte
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 14,
        name: 'Le Peuple des Ombres',
        description: 'Exclusivement des mutants, qui ont développé des aptitudes de discrétion, de furtivité et de dissimulation. Les membres du Peuple des Ombres sont souvent vêtus de peaux et de matériaux naturels sombres, leur permettant de se fondre dans l\'environnement. Ils se déplacent silencieusement et sont réputés pour leur discrétion, leur agilité et leur capacité à se cacher dans n\'importe quel décor. Ils survivent en évitant le conflit direct et sont d\'excellents chasseurs et pisteurs, proposant leurs services comme éclaireurs ou espions discrets à ceux qui les paient bien et respectent leur mode de vie. Pragmatiques et méfiants, ils croient en l\'adaptation ultime et considèrent que le conflit direct est une perte d\'énergie.',
        faction_id: null,
        ethnie_id: 1, // Exclusif aux Éveillés
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 15,
        name: 'Les Vagabonds du Vent',
        description: 'Clan mixte, composé d\'individus de toutes origines, souvent nomades. Voyageurs infatigables, souvent équipés de caravanes bricolées ou de montures mutées. Ils sont reconnaissables à leurs vêtements composites et leurs visages burinés par les éléments. Ils servent de marchands ambulants, de transporteurs ou de messagers entre les avant-postes ou les zones isolées. Ils vivent du commerce et de leur connaissance des routes et des dangers. Indépendants et opportunistes, ils valorisent la liberté de mouvement et le commerce. Ils sont les "traîtres" par excellence car ils interagissent avec les deux factions sans distinction, mais leur utilité les rend indispensables pour certains échanges.',
        faction_id: null,
        ethnie_id: null,
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 16,
        name: 'Les Artisans du Réemploi',
        description: 'Clan mixte, mais avec une prédominance de non-mutants possédant des compétences techniques ou des connaissances en confection et réparation. Mains calleuses, vêtements robustes, souvent entourés d\'outils et de pièces récupérées. Spécialistes de la récupération et de la réparation, ils réparent tenues et armes, et construisent de nouveaux équipements à partir des débris du passé ou des ressources glanées. Ils sont les "mécaniciens" du monde post-cataclysmique. Pragmatisme absolu : ils ne se soucient que de la fonction et de l\'efficacité. Ils sont souvent embauchés par les deux factions pour leurs compétences uniques, ignorant les idéologies tant qu\'ils sont payés en ressources ou en matériaux.',
        faction_id: null,
        ethnie_id: null,
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 17,
        name: 'Les Frères de la Terre Brûlée',
        description: 'Exclusivité non-mutants, souvent des anciens soldats, des marginaux ou des exilés des Sentinelles. Apparence austère, disciplinée, mais avec une touche de désespoir. Ils sont stoïques et efficaces. Ils survivent par tous les moyens dans les zones les plus dangereuses, souvent en tant que mercenaires d\'élite ou gardes du corps. Ils connaissent les terrains hostiles et les tactiques de survie dans des conditions extrêmes. Cyniques et désabusés, ils ne croient plus aux grandes idéologies des factions, ayant vu trop de destructions. Ils se battent pour leur propre survie et celle de leur petit groupe, vendant leurs services aux plus offrants, quel que soit leur camp.',
        faction_id: null,
        ethnie_id: 2, // Exclusif aux Inaltérés
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 18,
        name: 'Le Sanctuaire du Silence',
        description: 'Principalement des non-mutants ayant rejeté la violence et les dogmes des factions. Peut inclure quelques mutants pacifistes. Vivent dans des retraites isolées, souvent des lieux oubliés ou naturellement protégés. Ils ont une apparence simple et humble. Ils préservent la paix intérieure et la vie simple. Ils cultivent, vivent en autosuffisance et offrent un refuge temporaire à ceux qui cherchent la quiétude, sans prendre part aux conflits. Pacifistes et contemplatifs, ils pensent que la division et le conflit sont les véritables maux de l\'humanité. Ils sont perçus comme faibles ou naïfs par les factions, mais parfois respectés pour leur capacité à vivre en harmonie avec le monde.',
        faction_id: null,
        ethnie_id: null,
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 19,
        name: 'Les Collecteurs de Chuchotis',
        description: 'Clan mixte, souvent des mutants et des non-mutants qui excellent dans l\'observation et la communication. Discrets, observateurs, ils passent inaperçus. Ils collectent des informations plutôt que des objets. Ils accumulent des rumeurs, des faits, des secrets et des informations sur tout ce qui se passe dans le monde. Ils sont les "oreilles" et les "yeux" des Terres Désolées. Ils vendent des informations vérifiées à prix d\'or à ceux qui peuvent les utiliser, qu\'il s\'agisse de factions, d\'autres clans ou d\'individus. Neutres par nécessité, leur survie dépend de leur capacité à ne jamais prendre parti et à rester impartiaux.',
        faction_id: null,
        ethnie_id: null,
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 20,
        name: 'Les Semeurs d\'Espoir',
        description: 'Clan mixte, dont les membres sont unis par une vision d\'un avenir de réconciliation. Apparence ouverte et accueillante. Ils voyagent souvent avec des semences rares ou des outils pour restaurer des terres. Ils tentent de reverdir le monde, de restaurer des écosystèmes et de planter les graines d\'une nouvelle civilisation où mutants et non-mutants pourraient coexister. Ils sont des agriculteurs, des botanistes et des diplomates improvisés. Idéalistes et persévérants, ils croient que le monde peut guérir et que la division est une maladie. Ils sont activement rejetés par les factions principales, qui voient leur idéologie comme une faiblesse ou une menace à leur propre pureté/évolution.',
        faction_id: null,
        ethnie_id: null,
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 21,
        name: 'Les Loups Solitaires',
        description: 'Clan mixte, composé d\'individus opportunistes et sans foi ni loi, rejetés par les factions et les autres clans. Apparence souvent négligée et intimidante. Ils sont vêtus de bric et de broc, avec des pièces d\'armure de fortune et des armes de fortune. Ils voyagent seuls ou en petits groupes armés et sont reconnaissables par leur attitude agressive et leur manque de respect pour les autres. Ils survivent par le vol, l\'intimidation et la force. Ils attaquent les convois de marchandises, les voyageurs isolés et même de temps en temps les avant-postes pour piller leurs ressources. La loi du plus fort est leur seule règle. Ils n\'ont pas d\'idéologie, si ce n\'est la survie et l\'accumulation de biens.',
        faction_id: null,
        ethnie_id: null,
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      },
      {
        id: 22,
        name: 'Les Dévoreurs d\'Âmes',
        description: 'Clan exclusivement mutant, formé de fanatiques et d\'exilés issus des Prophètes de l\'Harmonie, bannis pour avoir poussé l\'idéologie des mutants à des extrêmes terrifiants. Leur apparence est souvent dérangée, avec des parures faites d\'ossements et de peaux de leurs victimes. Ils se couvrent de signes rituels et de peinture corporelle, et leur regard est empreint d\'une folie glaçante. Ils se considèrent comme les véritables élus de la mutation, cherchant à "purifier" les âmes en consommant la chair des autres, mutants et non-mutants, pour absorber leur "essence vitale". Ils chassent et capturent sans pitié pour leurs rituels cannibales. Leur idéologie est une perversion de la croyance des mutants. Ils pensent que le cataclysme a créé un monde de chaos et que la seule façon de s\'élever est de s\'abandonner totalement à ce chaos, à travers le cannibalisme et les sacrifices.',
        faction_id: null,
        ethnie_id: 1, // Exclusif aux Éveillés
        is_playable: false,
        leader_character_id: null,
        leader_name: null,
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clans', null, {});
  }
};
