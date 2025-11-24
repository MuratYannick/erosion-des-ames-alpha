# Branch Progress: feature/user-profile

## Objectif de la branche
Mise en place du profil utilisateur et du changement de mot de passe.

## Stack technique utilisee
- **Backend** : Node.js + Express + Sequelize + MySQL
- **Frontend** : Vite + React + TailwindCSS

---

## Specifications

### Changement de mot de passe (utilisateur connecte)

#### Flux
1. L'utilisateur va sur sa page profil
2. Il entre son ancien mot de passe
3. Il entre le nouveau mot de passe (+ confirmation)
4. Le backend verifie l'ancien mot de passe
5. Le nouveau mot de passe est enregistre

#### Securite
- Requiert authentification
- Verification de l'ancien mot de passe obligatoire
- Validation du nouveau mot de passe (memes regles que register)

---

## Taches

### Backend - Route Change Password
- [x] PUT /api/v1/auth/change-password
- [x] Validation (ancien mot de passe, nouveau mot de passe)
- [x] Service changePassword dans auth.service.js
- [x] Controller changePassword dans auth.controller.js

### Backend - Tests
- [x] Tests change-password avec ancien mot de passe correct
- [x] Tests change-password avec ancien mot de passe incorrect
- [x] Tests validation nouveau mot de passe
- [x] Tests integration (login avec nouveau/ancien password)

### Frontend - Page Profil
- [x] Page Profile.jsx
- [x] Affichage infos utilisateur
- [x] Formulaire changement mot de passe
- [x] Route /profile

### Frontend - Navigation
- [x] Lien vers profil dans la navigation
- [x] Protection de la route (authentification requise)

### Documentation
- [x] Documenter la route change-password
- [x] Mettre a jour BACK_ARCHITECTURE.md

---

## Progression

| Categorie | Progression |
|-----------|-------------|
| Backend - Route | 4/4 |
| Backend - Tests | 4/4 |
| Frontend - Page | 4/4 |
| Frontend - Navigation | 2/2 |
| Documentation | 2/2 |
| **Total** | **16/16** |

---

## Routes API a implementer

| Methode | Route | Description | Auth |
|---------|-------|-------------|------|
| PUT | `/api/v1/auth/change-password` | Changer mot de passe | Oui |

### Body attendu
```json
{
  "currentPassword": "AncienMotDePasse1!",
  "newPassword": "NouveauMotDePasse1!"
}
```

### Reponses
- 200 : Mot de passe change avec succes
- 400 : Validation echouee (nouveau mot de passe invalide)
- 401 : Non authentifie
- 403 : Ancien mot de passe incorrect

---

## Historique

| Date | Tache | Statut |
|------|-------|--------|
| 2025-11-24 | Creation de la branche | Fait |
| 2025-11-24 | Backend route change-password | Fait |
| 2025-11-24 | Frontend page profil | Fait |
| 2025-11-24 | Tests (8 nouveaux, 130 total) | Fait |
| 2025-11-24 | Documentation | Fait |
| 2025-11-24 | **Feature complete** | **16/16** |
