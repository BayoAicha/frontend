
#  MaBibliothèque

Ce projet est une application web de gestion de bibliothèque universitaire.
Elle permet aux étudiants d'emprunter des livres, de laisser des commentaires,
et aux administrateurs de gérer les livres, les utilisateurs et les emprunts.

---

##  Fonctionnalités principales

✅ Authentification (Inscription, Connexion, Déconnexion)  

✅ Espace étudiant :
- Consulter la liste des livres sur la page Livres
- Filtrer les livres par titre, auteur ou genre
- Emprunter des livres disponibles
- Laisser des commentaires et des notes sur les livres en cliquant sur    les nom des livres.
- Voir ses emprunts sur la page Emprunts

✅ Espace administrateur :
- Ajouter, modifier et supprimer des livres sur la page Livres
- Voir la liste de tous les utilisateurs sur la page Gestion utilisateurs et emprunts
- Voir tous les emprunts en cours ou terminés sur la page Gestions utilisateurs et emprunts
- Filtrer et rechercher les emprunts 

---

## 🗂️ Structure du projet

```
📁 backend/
  ├─ config/
  ├─ controllers/
  ├─ middleware/
  ├─ routes/
  ├─ server.js

📁 frontend/
  ├─ src/
      ├─ components/
      ├─ pages/
      ├─ App.js
      ├─ index.js
```

---

## ⚙️ Technologies utilisées

- **Backend** : Node.js, Express, MySQL
- **Frontend** : React.js, Axios, Tailwind CSS
- **Sécurité** : JWT pour l’authentification
- **Base de données** : MySQL

---

##  Installation

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo
```

### 2️⃣ Installer les dépendances backend
```bash
cd backend
npm install
```

### 3️⃣ Configurer la base de données

- Créer une base de données **bibliotheque**
- Importer les tables :
  - `utilisateurs`
  - `livres`
  - `emprunts`
  - `commentaires`
- Mettre à jour les infos de connexion dans `backend/config/db.js` :
  ```js
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bibliotheque",
  });
  ```

- Créer un fichier `.env` :
  ```
  JWT_SECRET=tonsecretici
  ```

### 4️⃣ Lancer le backend
```bash
npm start
```

---

### 5️⃣ Installer les dépendances frontend
```bash
cd ../frontend
npm install
```

### 6️⃣ Lancer le frontend
```bash
npm start
```

---

## 🗝️ Connexion par défaut

- **Exemple d'administrateur** : admin@gmail.com
 **Mot de passe administrateur** : motdepasseadmin 

- **Exmple d'Étudiant** : sylvain@example.com
- **Mot de passe etudiant**: secret123


---

## 📌 Routes principales

- `/api/auth/register` → Inscription
- `/api/auth/login` → Connexion
- `/api/livres` → Liste des livres
- `/api/emprunts` → Emprunts d’un utilisateur
- `/api/admin/users` → Liste utilisateurs (administrateur)
- `/api/admin/emprunts` → Liste emprunts (admininstrateur)
- `/api/commentaires` → Commentaires d’un livre


---

## 💡 Auteure

- **BAYO Aïchatou**
- 2ie
- Contact : aichadjaridbayo@gmail.com


