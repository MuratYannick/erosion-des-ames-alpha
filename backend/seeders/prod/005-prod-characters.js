'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    let characterId = 1;

    const characters = [];

    // ==========================================
    // FACTION 1: LES ÉCLAIREURS DE L'AUBE NOUVELLE
    // ==========================================

    // Clan 1: Les Prophètes de l'Harmonie (Leader - non jouable)
    characters.push({
      id: characterId++,
      name: 'Zarak le Visionnaire',
      user_id: null,
      ethnie_id: 1,
      faction_id: 1,
      clan_id: 1,
      is_dead: false,
      is_leader: true,
      description: 'Grand Prophète des Éclaireurs, herboriste et guérisseur autoproclamé chamane. Il dirige la faction avec une foi inébranlable en la mutation comme voie divine.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres pour le clan leader (non jouable)
    const prophetsMembers = [
      { name: 'Myralis la Voyante', desc: 'Disciple principale de Zarak, elle interprète les signes du monde muté.' },
      { name: 'Korven l\'Oracle', desc: 'Ancien guerrier devenu fanatique, garde du corps du Grand Prophète.' },
      { name: 'Silène la Médium', desc: 'Spécialiste des rituels de communion avec les mutations.' },
      { name: 'Dravos le Purificateur', desc: 'Exécuteur des volontés divines, chasse les hérétiques.' },
      { name: 'Ysara la Chuchotante', desc: 'Collecte et transmet les révélations aux autres clans.' }
    ];

    prophetsMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: 1,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 2: La Caste des Symbiotes (Jouable)
    characters.push({
      id: characterId++,
      name: 'Thalion Racine-Verte',
      user_id: null,
      ethnie_id: 1,
      faction_id: 1,
      clan_id: 2,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Symbiotes, capable de communiquer intuitivement avec la flore mutée. Responsable de l\'approvisionnement en ressources de l\'avant-poste.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const symbiotesMembers = [
      { name: 'Lysra la Cultivatrice', desc: 'Experte en agriculture mutée, développe de nouvelles cultures adaptées.' },
      { name: 'Vortan l\'Architecte', desc: 'Construit et adapte les structures en utilisant des matériaux organiques.' },
      { name: 'Nira Eau-Pure', desc: 'Spécialiste de la purification de l\'eau par symbiose avec des organismes mutés.' }
    ];

    symbiotesMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: 2,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 3: La Caste des Sensitifs (Jouable)
    characters.push({
      id: characterId++,
      name: 'Kaela Œil-Perçant',
      user_id: null,
      ethnie_id: 1,
      faction_id: 1,
      clan_id: 3,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Sensitifs, ses sens hyper-développés lui permettent de détecter les dangers à des kilomètres. Guide principale des expéditions.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const sensitifsMembers = [
      { name: 'Rhen le Pisteur', desc: 'Capable de suivre n\'importe quelle piste, même ancienne ou effacée.' },
      { name: 'Shara Sens-Aiguisés', desc: 'Perçoit les changements atmosphériques et anticipe les tempêtes mutées.' },
      { name: 'Jorik l\'Éclaireur', desc: 'Spécialiste de la navigation dans les territoires les plus hostiles.' }
    ];

    sensitifsMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: 3,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 4: La Caste des Forgerons de Chair (Jouable)
    characters.push({
      id: characterId++,
      name: 'Malakar Main-Sanglante',
      user_id: null,
      ethnie_id: 1,
      faction_id: 1,
      clan_id: 4,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Forgerons de Chair, maître guérisseur et empoisonneur. Sa connaissance des organismes mutés est sans égale.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const forgeronsMembers = [
      { name: 'Vessa la Soigneuse', desc: 'Guérisseuse utilisant des techniques considérées barbares mais efficaces.' },
      { name: 'Drakon le Toxicologue', desc: 'Spécialiste des poisons et antidotes issus de la faune mutée.' },
      { name: 'Iryn la Biologiste', desc: 'Étudie et catalogue toutes les nouvelles formes de vie découvertes.' }
    ];

    forgeronsMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: 4,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 5: La Caste des Sentinelles du Chaos (Jouable)
    characters.push({
      id: characterId++,
      name: 'Grashak Poing-de-Fer',
      user_id: null,
      ethnie_id: 1,
      faction_id: 1,
      clan_id: 5,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Sentinelles du Chaos, guerrier redoutable dont la force physique a été exacerbée par la mutation. Stratège militaire de la faction.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const sentinellesMembers = [
      { name: 'Korgath le Bouclier', desc: 'Défenseur principal de l\'avant-poste, spécialiste du combat rapproché.' },
      { name: 'Zyra la Chasseuse', desc: 'Traque et élimine les créatures hostiles menaçant le territoire.' },
      { name: 'Brutus Brise-Os', desc: 'Expert en tactiques de combat, entraîne les nouvelles recrues.' }
    ];

    sentinellesMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: 5,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 6: La Caste des Scrutateurs (Jouable)
    characters.push({
      id: characterId++,
      name: 'Elara Cherche-Vérité',
      user_id: null,
      ethnie_id: 1,
      faction_id: 1,
      clan_id: 6,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Scrutateurs, obsédée par la compréhension de la chute de l\'ancien monde. Archive et analyse tous les artefacts récupérés.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const scrutateursMembers = [
      { name: 'Dorian le Fouilleur', desc: 'Expert en exploration de ruines, désamorce les pièges anciens.' },
      { name: 'Mira la Déchiffreuse', desc: 'Décode les écrits et technologies de l\'ancien monde.' },
      { name: 'Kael Œil-de-Fer', desc: 'Évalue et récupère les artefacts potentiellement dangereux pour la faction ennemie.' }
    ];

    scrutateursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: 6,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // 5 membres de la faction sans clan
    const eclaireursSansClan = [
      { name: 'Voran l\'Errant', desc: 'Mutant solitaire servant la faction en missions spéciales.' },
      { name: 'Selene la Messagère', desc: 'Assure les communications entre les différents avant-postes éveillés.' },
      { name: 'Thorak le Banni', desc: 'Ancien membre des Prophètes, effectue maintenant des missions de reconnaissance.' },
      { name: 'Nyssa Peau-Grise', desc: 'Espionne infiltrée dans les territoires neutres.' },
      { name: 'Krix le Mutant', desc: 'Mutation extrême, utilisé pour intimider et impressionner.' }
    ];

    eclaireursSansClan.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: 1,
        clan_id: null,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // ==========================================
    // FACTION 2: LES VEILLEURS DE L'ANCIEN MONDE
    // ==========================================

    // Clan 7: Les Élus d'Avant (Leader - non jouable)
    characters.push({
      id: characterId++,
      name: 'Commandeur Aldric Valcrest',
      user_id: null,
      ethnie_id: 2,
      faction_id: 2,
      clan_id: 7,
      is_dead: false,
      is_leader: true,
      description: 'Chef suprême des Veilleurs, ancien militaire devenu gardien de l\'héritage humain. Dirigeant autoritaire mais juste, garant de la pureté de la faction.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres pour le clan leader
    const elusMembers = [
      { name: 'Dame Cassandra Morven', desc: 'Conseillère principale, spécialiste en histoire et traditions.' },
      { name: 'Capitaine Theron Ashford', desc: 'Bras droit militaire du Commandeur, tacticien brillant.' },
      { name: 'Magistrat Viktor Crane', desc: 'Arbitre des conflits internes, gardien des lois.' },
      { name: 'Archonte Elise Raven', desc: 'Gardienne des archives ancestrales et des protocoles.' },
      { name: 'Sénéchal Marcus Vorne', desc: 'Gère la logistique et les ressources stratégiques de la faction.' }
    ];

    elusMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: 7,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 8: Le Clan des Sentinelles (Jouable)
    characters.push({
      id: characterId++,
      name: 'Capitaine Gavin Ironside',
      user_id: null,
      ethnie_id: 2,
      faction_id: 2,
      clan_id: 8,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Sentinelles, vétéran aguerri responsable de la défense de la Citadelle. Maintient l\'ordre avec discipline et fermeté.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const sentinellesVeilleursMembers = [
      { name: 'Lieutenant Sarah Blackwood', desc: 'Seconde du Capitaine, excellente tacticienne défensive.' },
      { name: 'Sergent Dmitri Volkov', desc: 'Entraîne les nouvelles recrues, spécialiste du combat urbain.' },
      { name: 'Garde Elena Frost', desc: 'Responsable des patrouilles nocturnes et de la surveillance.' }
    ];

    sentinellesVeilleursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: 8,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 9: Le Clan des Pourvoyeurs (Jouable)
    characters.push({
      id: characterId++,
      name: 'Intendant Marcus Redfield',
      user_id: null,
      ethnie_id: 2,
      faction_id: 2,
      clan_id: 9,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Pourvoyeurs, génie de la logistique et de la gestion des ressources. Assure la survie matérielle de tous les clans.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const pourvoyeursMembers = [
      { name: 'Helena la Fermière', desc: 'Responsable des cultures et de l\'élevage en environnement contrôlé.' },
      { name: 'Jacob l\'Ingénieur', desc: 'Maintient les purificateurs d\'eau et les infrastructures vitales.' },
      { name: 'Marta la Distributrice', desc: 'Gère l\'approvisionnement équitable entre les différents clans.' }
    ];

    pourvoyeursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: 9,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 10: Le Clan des Archivistes (Jouable)
    characters.push({
      id: characterId++,
      name: 'Bibliothécaire Evelyn Greymoor',
      user_id: null,
      ethnie_id: 2,
      faction_id: 2,
      clan_id: 10,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Archivistes, gardienne du savoir ancestral. Sa mémoire encyclopédique préserve l\'histoire de l\'humanité.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const archivistesMembers = [
      { name: 'Professeur Nathaniel Stone', desc: 'Érudit spécialisé dans les technologies pré-cataclysme.' },
      { name: 'Chroniqueur Adrian Vale', desc: 'Documente les événements actuels et maintient les archives vivantes.' },
      { name: 'Maître Lydia Ashton', desc: 'Enseigne l\'histoire et les valeurs aux jeunes générations.' }
    ];

    archivistesMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: 10,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 11: Le Clan des Purificateurs (Jouable)
    characters.push({
      id: characterId++,
      name: 'Docteur Amelia Whitehall',
      user_id: null,
      ethnie_id: 2,
      faction_id: 2,
      clan_id: 11,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Purificateurs, médecin en chef obsédée par la préservation de la pureté génétique. Développe des traitements contre la contamination.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const purificateursMembers = [
      { name: 'Infirmier Thomas Reed', desc: 'Soigne les blessés et surveille les signes de mutation.' },
      { name: 'Chimiste Rachel Winters', desc: 'Développe des remèdes et des décontaminants.' },
      { name: 'Inspecteur Henry Blake', desc: 'Contrôle l\'hygiène et la qualité de l\'eau et de la nourriture.' }
    ];

    purificateursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: 11,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 12: Le Clan des Explorateurs (Jouable)
    characters.push({
      id: characterId++,
      name: 'Éclaireur-Chef Logan Steele',
      user_id: null,
      ethnie_id: 2,
      faction_id: 2,
      clan_id: 12,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Explorateurs, cartographe expérimenté. A survécu à plus d\'expéditions dangereuses que quiconque dans la faction.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 3 membres
    const explorateursMembers = [
      { name: 'Scout Julia Reeves', desc: 'Spécialiste de la reconnaissance rapide en territoire hostile.' },
      { name: 'Cartographe Owen Fletcher', desc: 'Crée et met à jour les cartes des terres explorées.' },
      { name: 'Guide Maya Thornton', desc: 'Experte en survie et négociation avec les clans neutres.' }
    ];

    explorateursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: 12,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // 5 membres de la faction sans clan
    const veilleursSansClan = [
      { name: 'Agent Silas Harper', desc: 'Espion infiltré dans les territoires neutres.' },
      { name: 'Émissaire Claire Donovan', desc: 'Diplomate non officielle pour contacts avec clans neutres.' },
      { name: 'Vétéran Jack Morrison', desc: 'Ancien soldat opérant en solo, missions spéciales.' },
      { name: 'Technicien Rebecca Cole', desc: 'Spécialiste en récupération technologique, opère seule.' },
      { name: 'Pisteur William Cross', desc: 'Traque les déserteurs et surveille les frontières.' }
    ];

    veilleursSansClan.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: 2,
        clan_id: null,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // ==========================================
    // CLANS NEUTRES
    // ==========================================

    // Clan 13: Les Veilleurs des Ruines
    characters.push({
      id: characterId++,
      name: 'Archéologue Magnus Grayson',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 13,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Veilleurs des Ruines, historien obsédé par la vérité sur le cataclysme. Refuse tout parti pris idéologique.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const veilleursRuinesMembers = [
      { name: 'Léa la Cartographe', desc: 'Documente précisément chaque ruine explorée.', ethnie: 2 },
      { name: 'Samuel le Préservateur', desc: 'Restaure et protège les artefacts fragiles.', ethnie: 2 },
      { name: 'Nina l\'Analyste', desc: 'Étudie les causes techniques de l\'effondrement.', ethnie: 2 },
      { name: 'Marcus l\'Écrivain', desc: 'Consigne toutes les découvertes dans des archives neutres.', ethnie: 2 },
      { name: 'Vera la Mutante Érudite', desc: 'Apporte une perspective unique sur l\'ancien monde.', ethnie: 1 }
    ];

    veilleursRuinesMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 13,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 14: Le Peuple des Ombres
    characters.push({
      id: characterId++,
      name: 'Ombrage le Silencieux',
      user_id: null,
      ethnie_id: 1,
      faction_id: null,
      clan_id: 14,
      is_dead: false,
      is_leader: true,
      description: 'Leader du Peuple des Ombres, maître de la discrétion. On dit qu\'il peut disparaître à volonté.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const peupleOmbresMembers = [
      { name: 'Nyx la Chasseuse', desc: 'Pisteur fantôme, traque sa proie sans jamais être vue.' },
      { name: 'Raven l\'Espion', desc: 'Vend ses services d\'infiltration au plus offrant.' },
      { name: 'Shade le Furtif', desc: 'Spécialiste de l\'évasion et de la disparition.' },
      { name: 'Whisper la Messagère', desc: 'Transmet des informations confidentielles entre clans.' },
      { name: 'Umbra le Guetteur', desc: 'Observe et rapporte les mouvements des factions.' }
    ];

    peupleOmbresMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: null,
        clan_id: 14,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 15: Les Vagabonds du Vent
    characters.push({
      id: characterId++,
      name: 'Merchant Ezra Windwalker',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 15,
      is_dead: false,
      is_leader: true,
      description: 'Chef de la caravane principale, négociateur habile connaissant toutes les routes commerciales.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const vagabondsMembers = [
      { name: 'Rosa la Négociante', desc: 'Spécialiste du troc, connaît la valeur de tout.', ethnie: 2 },
      { name: 'Finn le Conducteur', desc: 'Pilote les caravanes à travers les territoires dangereux.', ethnie: 2 },
      { name: 'Lyra la Messagère', desc: 'Transporte courriers et nouvelles entre les avant-postes.', ethnie: 1 },
      { name: 'Gregor l\'Éclaireur', desc: 'Trouve les routes les plus sûres et les plus rapides.', ethnie: 2 },
      { name: 'Mira la Mutante', desc: 'Assure la sécurité des caravanes avec ses capacités.', ethnie: 1 }
    ];

    vagabondsMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 15,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 16: Les Artisans du Réemploi
    characters.push({
      id: characterId++,
      name: 'Maître Forgeron Gareth Steelhand',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 16,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Artisans, capable de réparer ou créer n\'importe quoi à partir de débris. Pragmatique absolu.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const artisansMembers = [
      { name: 'Petra la Mécanicienne', desc: 'Répare armes et équipements complexes.', ethnie: 2 },
      { name: 'Torin l\'Armurier', desc: 'Forge des armes à partir de matériaux récupérés.', ethnie: 2 },
      { name: 'Ida la Couturière', desc: 'Confectionne armures et vêtements résistants.', ethnie: 2 },
      { name: 'Bruno le Recycleur', desc: 'Trie et évalue les débris pour en extraire l\'utile.', ethnie: 1 },
      { name: 'Vera l\'Inventrice', desc: 'Crée des outils innovants à partir de rebuts.', ethnie: 2 }
    ];

    artisansMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 16,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 17: Les Frères de la Terre Brûlée
    characters.push({
      id: characterId++,
      name: 'Commandant Graves Ashborn',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 17,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Frères, ancien soldat d\'élite des Veilleurs. Cynique et désabusé, mais redoutablement efficace.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const freresMembers = [
      { name: 'Sergent Drake Ironheart', desc: 'Vétéran spécialisé dans les zones de guerre.' },
      { name: 'Sniper Luna Coldstrike', desc: 'Tireuse d\'élite, ne rate jamais sa cible.' },
      { name: 'Mercenaire Thorn Bloodfist', desc: 'Combat au corps-à-corps, garde du corps redoutable.' },
      { name: 'Tactician Rex Stormborn', desc: 'Planifie les opérations des mercenaires.' },
      { name: 'Medic Kate Scarface', desc: 'Soigne les blessés sur le terrain, imperturbable.' }
    ];

    freresMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: null,
        clan_id: 17,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 18: Le Sanctuaire du Silence
    characters.push({
      id: characterId++,
      name: 'Sage Miriam Peaceheart',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 18,
      is_dead: false,
      is_leader: true,
      description: 'Leader du Sanctuaire, guide spirituelle prônant la non-violence. Offre refuge à tous ceux qui cherchent la paix.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const sanctuaireMembers = [
      { name: 'Frère Thomas Gentlehands', desc: 'Cultive les jardins et prépare les repas communautaires.', ethnie: 2 },
      { name: 'Sœur Clara Softvoice', desc: 'Accueille et réconforte les réfugiés traumatisés.', ethnie: 2 },
      { name: 'Moine Ethan Stillwater', desc: 'Médite et enseigne la contemplation pacifique.', ethnie: 2 },
      { name: 'Herboriste Lily Greenleaf', desc: 'Cultive des plantes médicinales apaisantes.', ethnie: 2 },
      { name: 'Mutant pacifiste Zephyr', desc: 'Prouve qu\'éveillés et inaltérés peuvent coexister.', ethnie: 1 }
    ];

    sanctuaireMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 18,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 19: Les Collecteurs de Chuchotis
    characters.push({
      id: characterId++,
      name: 'Maître Informateur Silas Whisperwind',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 19,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Collecteurs, courtier en informations le plus respecté des terres désolées. Sait tout sur tout le monde.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const collecteursMembers = [
      { name: 'Agent Iris Shadowear', desc: 'Collecte des rumeurs dans les tavernes et marchés.', ethnie: 2 },
      { name: 'Espion Felix Quicktongue', desc: 'Infiltre les groupes pour obtenir des secrets.', ethnie: 1 },
      { name: 'Observateur Mila Keeneye', desc: 'Surveille les mouvements des factions.', ethnie: 2 },
      { name: 'Analyste Dorian Mindweaver', desc: 'Recoupe et vérifie toutes les informations collectées.', ethnie: 1 },
      { name: 'Courtier Zara Silverlip', desc: 'Négocie la vente d\'informations aux clients.', ethnie: 2 }
    ];

    collecteursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 19,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 20: Les Semeurs d'Espoir
    characters.push({
      id: characterId++,
      name: 'Visionnaire Eden Greenhart',
      user_id: null,
      ethnie_id: 2,
      faction_id: null,
      clan_id: 20,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Semeurs, botaniste idéaliste rêvant d\'un monde réconcilié. Plante des graines d\'espoir partout où il passe.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const semeursMembers = [
      { name: 'Agronome Vera Bloomfield', desc: 'Développe des cultures résistantes pour reverdir la terre.', ethnie: 2 },
      { name: 'Diplomate Lucas Bridgemaker', desc: 'Tente de créer des ponts entre mutants et non-mutants.', ethnie: 2 },
      { name: 'Botaniste Aria Seedkeeper', desc: 'Préserve les semences rares de l\'ancien monde.', ethnie: 1 },
      { name: 'Mutant pacifiste Terra Rootstrong', desc: 'Démontre la possibilité de coexistence harmonieuse.', ethnie: 1 },
      { name: 'Éducatrice Maya Hopelight', desc: 'Enseigne aux enfants la tolérance et l\'unité.', ethnie: 2 }
    ];

    semeursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 20,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 21: Les Loups Solitaires
    characters.push({
      id: characterId++,
      name: 'Chef de Meute Kraven Bloodclaw',
      user_id: null,
      ethnie_id: 1,
      faction_id: null,
      clan_id: 21,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Loups, bandit brutal ne respectant que la force. Pille tout ce qu\'il peut sans remords.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const loupsMembers = [
      { name: 'Brute Gorak Skullcrusher', desc: 'Attaque les convois avec une violence bestiale.', ethnie: 1 },
      { name: 'Voleuse Sly Quickfingers', desc: 'Dérobe les ressources pendant que les autres se battent.', ethnie: 2 },
      { name: 'Pillard Vex Scarface', desc: 'Intimide et terrorise les voyageurs isolés.', ethnie: 2 },
      { name: 'Marauder Raze Burnhand', desc: 'Met le feu aux camps après les avoir pillés.', ethnie: 1 },
      { name: 'Mutant Ravage Madclaw', desc: 'Utilise sa force mutée pour briser les défenses.', ethnie: 1 }
    ];

    loupsMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: member.ethnie,
        faction_id: null,
        clan_id: 21,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Clan 22: Les Dévoreurs d'Âmes
    characters.push({
      id: characterId++,
      name: 'Grand Dévoreur Malkor le Fou',
      user_id: null,
      ethnie_id: 1,
      faction_id: null,
      clan_id: 22,
      is_dead: false,
      is_leader: true,
      description: 'Leader des Dévoreurs, ancien Prophète banni devenu cannibale fanatique. Sa folie est contagieuse et terrifiante.',
      created_at: now,
      updated_at: now,
      deleted_at: null
    });

    // 5 membres
    const devoureursMembers = [
      { name: 'Ritualiste Vorgath l\'Écorcheur', desc: 'Prépare les victimes pour les rituels cannibales.' },
      { name: 'Chasseur Zarek Bonegnawer', desc: 'Traque mutants et non-mutants pour les capturer vivants.' },
      { name: 'Prêtresse Nyxara Bloodmouth', desc: 'Dirige les cérémonies de consommation rituelle.' },
      { name: 'Mutant Drakkor Flesheater', desc: 'Sa mutation extrême reflète son mode de vie abject.' },
      { name: 'Tortionnaire Sylas Paincaller', desc: 'Prétend absorber la douleur pour se renforcer.' }
    ];

    devoureursMembers.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: null,
        clan_id: 22,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // ==========================================
    // PERSONNAGES SANS CLAN NI FACTION
    // ==========================================

    // 5 Éveillés sans clan ni faction
    const eveillesSolitaires = [
      { name: 'Kora la Nomade', desc: 'Mutante voyageant seule, refuse toute allégeance par principe.' },
      { name: 'Vex le Paria', desc: 'Rejeté par les Éclaireurs pour ses idées trop modérées.' },
      { name: 'Ash l\'Ermite', desc: 'Vit seul dans les terres désolées, évite tout contact.' },
      { name: 'Ryna la Libre', desc: 'Refuse les dogmes des factions, survit par ses propres moyens.' },
      { name: 'Gron le Mutant Sauvage', desc: 'Mutation extrême, vit comme un animal dans la nature.' }
    ];

    eveillesSolitaires.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 1,
        faction_id: null,
        clan_id: null,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // 5 Inaltérés sans clan ni faction
    const inalteresSolitaires = [
      { name: 'Jonas le Survivant', desc: 'Ancien Veilleur ayant fui la rigidité de la faction.' },
      { name: 'Emma la Désertrice', desc: 'A quitté les Veilleurs en désaccord avec leur idéologie.' },
      { name: 'Victor l\'Exilé', desc: 'Banni des Veilleurs pour avoir aidé un mutant.' },
      { name: 'Sarah la Solitaire', desc: 'Préfère vivre seule que sous le joug des Élus d\'Avant.' },
      { name: 'Markus le Vagabond', desc: 'Voyage seul, cherchant un sens à sa survie.' }
    ];

    inalteresSolitaires.forEach(member => {
      characters.push({
        id: characterId++,
        name: member.name,
        user_id: null,
        ethnie_id: 2,
        faction_id: null,
        clan_id: null,
        is_dead: false,
        is_leader: false,
        description: member.desc,
        created_at: now,
        updated_at: now,
        deleted_at: null
      });
    });

    // Insert tous les personnages
    await queryInterface.bulkInsert('characters', characters, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('characters', null, {});
  }
};
