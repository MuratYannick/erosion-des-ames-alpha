# Progress - feature/seeders-review

**Branche créée à partir de** : feature/forum
**Date de début** : 2025-10-30
**Objectif** : Révision complète du contenu des seeders avec séparation en deux catégories

---

## Objectif de la branche

Revoir pas à pas le contenu des tables généré par les seeders en les séparant en deux catégories distinctes :

### 1. Seeders de production (série initiale)
**Répertoire** : `backend/seeders/prod/`
**Objectif** : Initialiser les tables comme elles doivent être lors du lancement du site en production

**Concernés** :
- Ethnies (données fixes du lore)
- Factions (données fixes du lore)
- Clans (données fixes du lore)
- Catégories de forum (structure initiale du forum)
- Sections de forum (structure initiale du forum)
- Users (vide - prêt si nécessaire)
- Characters (vide - prêt si nécessaire)
- Topics (vide - prêt si nécessaire)
- Posts (vide - prêt si nécessaire)

**Caractéristiques** :
- Données essentielles au fonctionnement du site
- Données stables qui ne changeront pas
- À exécuter lors du premier déploiement en production
- Numérotation : `00x-prod-<table_name>.js` (001, 002, 003, etc.)
- **Toutes les tables ont un seeder** (même vide si inutile)

### 2. Seeders de développement (série complémentaire)
**Répertoire** : `backend/seeders/dev/`
**Objectif** : Fournir des données de test pour le développement

**Concernés** :
- Users (comptes de test)
- Ethnies (données supplémentaires si besoin)
- Factions (données supplémentaires si besoin)
- Clans (données supplémentaires si besoin)
- Characters (personnages de test)
- Categories (vide - structure déjà en prod)
- Sections (vide - structure déjà en prod)
- Topics (sujets de test)
- Posts (messages de test)

**Caractéristiques** :
- Données de test uniquement
- Ne seront jamais exécutés en production
- Permettent de tester les fonctionnalités
- Numérotation : `10x-dev-<table_name>.js` (101, 102, 103, etc.)
- **Toutes les tables ont un seeder** (même vide si inutile)

---

## État actuel des seeders

### Seeders existants
- [001-demo-users.js](backend/seeders/001-demo-users.js)
- [002-demo-ethnies.js](backend/seeders/002-demo-ethnies.js)
- [003-demo-factions.js](backend/seeders/003-demo-factions.js)
- [004-demo-clans.js](backend/seeders/004-demo-clans.js)
- [005-demo-characters.js](backend/seeders/005-demo-characters.js)
- [006-demo-categories.js](backend/seeders/006-demo-categories.js)
- [007-demo-sections.js](backend/seeders/007-demo-sections.js)
- [008-demo-topics.js](backend/seeders/008-demo-topics.js)
- [009-demo-posts.js](backend/seeders/009-demo-posts.js)

---

## Plan de révision

### Phase 1 : Restructuration des fichiers seeders
- [ ] Créer les répertoires `backend/seeders/prod/` et `backend/seeders/dev/`
- [ ] Créer tous les seeders de production (00x-prod-*.js)
- [ ] Créer tous les seeders de développement (10x-dev-*.js)
- [ ] Supprimer les anciens seeders obsolètes (00x-demo-*.js)
- [ ] Mettre à jour package.json avec de nouveaux scripts npm

### Phase 2 : Révision seeders de production
- [ ] 001-prod-users.js - Définir le contenu (probablement vide)
- [ ] 002-prod-ethnies.js - Réviser les données du lore
- [ ] 003-prod-factions.js - Réviser les données du lore
- [ ] 004-prod-clans.js - Réviser les données du lore
- [ ] 005-prod-characters.js - Définir le contenu (probablement vide)
- [ ] 006-prod-categories.js - Réviser la structure du forum
- [ ] 007-prod-sections.js - Réviser la structure du forum
- [ ] 008-prod-topics.js - Définir le contenu (probablement vide)
- [ ] 009-prod-posts.js - Définir le contenu (probablement vide)

### Phase 3 : Révision seeders de développement
- [ ] 101-dev-users.js - Créer les comptes de test
- [ ] 102-dev-ethnies.js - Définir le contenu (probablement vide)
- [ ] 103-dev-factions.js - Définir le contenu (probablement vide)
- [ ] 104-dev-clans.js - Définir le contenu (probablement vide)
- [ ] 105-dev-characters.js - Créer les personnages de test
- [ ] 106-dev-categories.js - Définir le contenu (probablement vide)
- [ ] 107-dev-sections.js - Définir le contenu (probablement vide)
- [ ] 108-dev-topics.js - Créer les sujets de test
- [ ] 109-dev-posts.js - Créer les messages de test

### Phase 4 : Tests et documentation
- [ ] Tester les seeders de production
- [ ] Tester les seeders de développement
- [ ] Tester les seeders combinés (prod + dev)
- [ ] Mettre à jour la documentation
- [ ] Créer un README dans chaque dossier de seeders

---

## Travail effectué

### 2025-10-30 - Initialisation de la branche
- ✅ Création de la branche feature/seeders-review
- ✅ Création du fichier BRANCH_PROGRESS.md
- ✅ Documentation de la stratégie des seeders
- ✅ Définition de la structure avec sous-répertoires prod/ et dev/
- ✅ Convention de nommage : 00x-prod-*.js et 10x-dev-*.js
- ✅ Décision : tous les seeders pour toutes les tables (même vides)

---

## Prochaines étapes

1. Commencer par la restructuration des fichiers
2. Définir précisément le contenu de chaque seeder de production
3. Définir précisément le contenu de chaque seeder de développement

---

## Notes techniques

### Structure des répertoires
```
backend/seeders/
├── prod/              # Seeders de production
│   ├── 001-prod-users.js
│   ├── 002-prod-ethnies.js
│   ├── 003-prod-factions.js
│   ├── 004-prod-clans.js
│   ├── 005-prod-characters.js
│   ├── 006-prod-categories.js
│   ├── 007-prod-sections.js
│   ├── 008-prod-topics.js
│   └── 009-prod-posts.js
└── dev/               # Seeders de développement
    ├── 101-dev-users.js
    ├── 102-dev-ethnies.js
    ├── 103-dev-factions.js
    ├── 104-dev-clans.js
    ├── 105-dev-characters.js
    ├── 106-dev-categories.js
    ├── 107-dev-sections.js
    ├── 108-dev-topics.js
    └── 109-dev-posts.js
```

### Convention de nommage
- **Production** : `00x-prod-<table_name>.js` (dans `backend/seeders/prod/`)
- **Développement** : `10x-dev-<table_name>.js` (dans `backend/seeders/dev/`)
- **Toutes les tables ont un seeder** dans chaque catégorie (même vide)

### Scripts npm à créer
```json
"db:seed:prod": "Exécuter uniquement les seeders de production",
"db:seed:dev": "Exécuter uniquement les seeders de développement",
"db:seed:all": "Exécuter tous les seeders (prod + dev)"
```

---

## Questions / Décisions en attente

- Contenu exact des données de production pour chaque table
- Nombre et type de données de test nécessaires
