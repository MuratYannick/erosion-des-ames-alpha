# Progress - feature/seeders-review

**Branche créée à partir de** : feature/forum
**Date de début** : 2025-10-30
**Objectif** : Révision complète du contenu des seeders avec séparation en deux catégories

---

## Objectif de la branche

Revoir pas à pas le contenu des tables généré par les seeders en les séparant en deux catégories distinctes :

### 1. Seeders de production (série initiale)
**Objectif** : Initialiser les tables comme elles doivent être lors du lancement du site en production

**Concernés** :
- Ethnies (données fixes du lore)
- Factions (données fixes du lore)
- Clans (données fixes du lore)
- Catégories de forum (structure initiale du forum)
- Sections de forum (structure initiale du forum)

**Caractéristiques** :
- Données essentielles au fonctionnement du site
- Données stables qui ne changeront pas
- À exécuter lors du premier déploiement en production
- Numérotation : 10x-xxx.js (101, 102, 103, etc.)

### 2. Seeders de développement (série complémentaire)
**Objectif** : Fournir des données de test pour le développement

**Concernés** :
- Users (comptes de test)
- Characters (personnages de test)
- Topics (sujets de test)
- Posts (messages de test)

**Caractéristiques** :
- Données de test uniquement
- Ne seront jamais exécutés en production
- Permettent de tester les fonctionnalités
- Numérotation : 20x-xxx.js (201, 202, 203, etc.)

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
- [ ] Renommer et réorganiser les seeders de production (10x-)
- [ ] Renommer et réorganiser les seeders de développement (20x-)
- [ ] Mettre à jour package.json avec de nouveaux scripts npm

### Phase 2 : Révision seeders de production
- [ ] 101-production-ethnies.js - Réviser le contenu
- [ ] 102-production-factions.js - Réviser le contenu
- [ ] 103-production-clans.js - Réviser le contenu
- [ ] 104-production-categories.js - Réviser le contenu
- [ ] 105-production-sections.js - Réviser le contenu

### Phase 3 : Révision seeders de développement
- [ ] 201-dev-users.js - Réviser le contenu
- [ ] 202-dev-characters.js - Réviser le contenu
- [ ] 203-dev-topics.js - Réviser le contenu
- [ ] 204-dev-posts.js - Réviser le contenu

### Phase 4 : Tests et documentation
- [ ] Tester les seeders de production
- [ ] Tester les seeders de développement
- [ ] Mettre à jour la documentation
- [ ] Créer un README dans le dossier seeders

---

## Travail effectué

### 2025-10-30 - Initialisation de la branche
- ✅ Création de la branche feature/seeders-review
- ✅ Création du fichier BRANCH_PROGRESS.md
- ✅ Documentation de la stratégie des seeders

---

## Prochaines étapes

1. Commencer par la restructuration des fichiers
2. Définir précisément le contenu de chaque seeder de production
3. Définir précisément le contenu de chaque seeder de développement

---

## Notes techniques

### Convention de nommage
- **Production** : `10x-production-<nom>.js`
- **Développement** : `20x-dev-<nom>.js`

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
