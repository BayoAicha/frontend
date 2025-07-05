
#  MaBibliothèque
# Frontend — Application de Gestion de Bibliothèque

Ce projet est une application web de gestion de bibliothèque universitaire.
Elle permet aux étudiants d'emprunter des livres, de laisser des commentaires,
et aux administrateurs de gérer les livres, les utilisateurs et les emprunts.
Ce frontend est construit avec **React.js** et consomme l’API Node.js/Express du backend.

## 🚀 Fonctionnalités

- Authentification (connexion / inscription)
- Navigation dynamique avec React Router
- Gestion des rôles : utilisateur (étudiant) ou administrateur
- Emprunt de livres pour les étudiants
- Ajout, modification, suppression de livres pour les administrateurs
- Section commentaires avec clic sur le mom du livre
- Espace profil
- Filtrage dynamique par auteur, genre ou titre

## 🗝️ Connexion par défaut

- **Exemple d'administrateur** : admin@gmail.com
 **Mot de passe administrateur** : motdepasseadmin 

- **Exmple d'Étudiant** : sylvain@example.com
- **Mot de passe etudiant**: secret123

## 📂 Structure du projet

```
Frontend/
 ├── public/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── App.js
 │   ├── index.js
 ├── package.json
 ├── .env
 ├── Dockerfile
```

## ⚙️ Variables d’environnement

Crée un fichier `.env` dans `Frontend/` :

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

**⚠️** Remplacez l’URL si votre backend tourne sur un autre domaine ou conteneur.

## 🖥️ Démarrer en local

```bash
cd Frontend
npm install
npm start
```

## 🐳 Utilisation avec Docker

```dockerfile
# Frontend/Dockerfile

FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
```

Puis construisez et exécute via `docker-compose` ou `docker build`.

## ✅ Bonnes pratiques

- Personnaliser `package.json` (nom, version…)
- Utiliser un reverse proxy en production (NGINX, Traefik)
- Bien sécuriser le `.env`
- Garder à jour les dépendances (ex: `npm outdated`)

## 💡 Auteure

- **BAYO Aïchatou**
- 2ie
- Contact : aichadjaridbayo@gmail.com
