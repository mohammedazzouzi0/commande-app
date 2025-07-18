# 🛒 Commande App

Application complète de gestion de commandes avec interface client et administration.

## ✨ Fonctionnalités

### 🏠 Interface Client
- Formulaire de commande intuitif
- Validation des données en temps réel
- Confirmation visuelle des commandes
- Design responsive et moderne

### 🔐 Interface Admin
- Authentification sécurisée
- Dashboard avec statistiques
- Gestion complète des commandes
- Filtrage et recherche
- Export CSV des données
- Modification des statuts

### ⚙️ Backend
- API REST complète
- Base de données MySQL
- Authentification JWT
- Rate limiting
- Gestion d'erreurs

## 🚀 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- MySQL (version 5.7 ou supérieure)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd commande-app
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données

#### Option A : Créer un fichier .env
Copiez le fichier `env.example` vers `.env` et configurez vos paramètres :

```bash
cp env.example .env
```

Modifiez le fichier `.env` :
```env
# Configuration Base de données MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=commande_app
DB_PORT=3306

# Configuration Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=votre_secret_jwt_tres_securise

# Configuration Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Configuration Serveur
PORT=3000
NODE_ENV=development
```

#### Option B : Utiliser les valeurs par défaut
L'application fonctionnera avec les valeurs par défaut si aucun fichier `.env` n'est trouvé.

### 4. Démarrer l'application
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'application sera accessible sur :
- **Interface client** : http://localhost:3000
- **Interface admin** : http://localhost:3000/admin
- **API Health** : http://localhost:3000/api/health

## 📊 Structure de la base de données

L'application crée automatiquement les tables suivantes :

### Table `commandes`
| Champ          | Type                           | Description                    |
| -------------- | ------------------------------ | ------------------------------ |
| id             | INT AUTO_INCREMENT PRIMARY KEY | Identifiant unique             |
| nom            | VARCHAR(100) NOT NULL          | Nom du client                  |
| telephone      | VARCHAR(20) NOT NULL           | Téléphone du client            |
| produit        | VARCHAR(200) NOT NULL          | Produit commandé               |
| adresse        | TEXT NOT NULL                  | Adresse de livraison           |
| quantite       | INT NOT NULL DEFAULT 1         | Quantité commandée             |
| statut         | ENUM('en attente', 'expédiée') | Statut de la commande          |
| date_commande  | TIMESTAMP DEFAULT CURRENT      | Date de la commande            |
| notes          | TEXT                           | Notes supplémentaires          |
| prix           | DECIMAL(10,2) DEFAULT 0.00     | Prix du produit                |

### Table `admin`
| Champ      | Type                    | Description                    |
| ---------- | ----------------------- | ------------------------------ |
| id         | INT AUTO_INCREMENT PK   | Identifiant unique             |
| username   | VARCHAR(50) UNIQUE      | Nom d'utilisateur admin        |
| password   | VARCHAR(255) NOT NULL   | Mot de passe hashé             |
| email      | VARCHAR(100)            | Email admin                    |
| created_at | TIMESTAMP DEFAULT NOW   | Date de création               |

## 🔐 Authentification Admin

### Compte par défaut
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`

⚠️ **Important** : Changez ces identifiants en production !

## 📱 Utilisation

### Interface Client
1. Accédez à http://localhost:3000
2. Remplissez le formulaire de commande
3. Cliquez sur "Envoyer la commande"
4. Recevez une confirmation

### Interface Admin
1. Accédez à http://localhost:3000/admin
2. Connectez-vous avec vos identifiants
3. Consultez le dashboard avec les statistiques
4. Gérez les commandes :
   - Voir les détails
   - Changer le statut
   - Supprimer une commande
5. Utilisez les filtres pour rechercher
6. Exportez les données en CSV

## 🔧 API Endpoints

### Commandes
- `POST /api/commandes` - Créer une commande
- `GET /api/commandes` - Lister toutes les commandes
- `GET /api/commandes/:id` - Récupérer une commande
- `PATCH /api/commandes/:id` - Modifier une commande
- `DELETE /api/commandes/:id` - Supprimer une commande

### Administration
- `POST /api/admin/login` - Connexion admin
- `GET /api/admin/profile` - Profil admin
- `GET /api/admin/commandes` - Commandes (protégé)
- `PATCH /api/admin/commandes/:id` - Modifier statut (protégé)
- `DELETE /api/admin/commandes/:id` - Supprimer (protégé)
- `GET /api/admin/stats` - Statistiques (protégé)

### Utilitaires
- `GET /api/health` - Santé de l'API

## 🎨 Personnalisation

### Modifier les produits
Éditez le fichier `frontend/index.html` pour changer la liste des produits :

```html
<select id="produit" name="produit" required>
    <option value="">Sélectionnez un produit</option>
    <option value="Votre Produit">Votre Produit - Prix€</option>
    <!-- Ajoutez vos produits ici -->
</select>
```

### Modifier les prix automatiques
Éditez le fichier `frontend/script.js` pour changer les prix :

```javascript
const prixMap = {
    'Votre Produit': 50,
    // Ajoutez vos produits et prix
};
```

### Personnaliser le design
Modifiez le fichier `frontend/style.css` pour adapter le design à votre marque.

## 🚀 Déploiement

### Heroku
1. Créez une base de données MySQL (ClearDB, JawsDB, etc.)
2. Configurez les variables d'environnement
3. Déployez avec `git push heroku main`

### VPS/Dedicated
1. Installez Node.js et MySQL
2. Clonez le projet
3. Configurez un reverse proxy (nginx)
4. Utilisez PM2 pour la gestion des processus

### Docker (optionnel)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Sécurité

### Recommandations
- Changez le `JWT_SECRET` en production
- Utilisez des mots de passe forts pour l'admin
- Configurez HTTPS en production
- Limitez l'accès à l'interface admin
- Sauvegardez régulièrement la base de données

### Variables d'environnement sensibles
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `DB_PASSWORD` : Mot de passe de la base de données
- `ADMIN_PASSWORD` : Mot de passe admin

## 🐛 Dépannage

### Erreur de connexion MySQL
- Vérifiez que MySQL est démarré
- Vérifiez les paramètres de connexion dans `.env`
- Assurez-vous que l'utilisateur a les droits nécessaires

### Erreur de port
- Changez le port dans `.env` si le port 3000 est occupé
- Vérifiez qu'aucune autre application n'utilise le port

### Problèmes d'authentification
- Vérifiez que les identifiants admin sont corrects
- Supprimez le token du localStorage si nécessaire
- Redémarrez l'application

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Consultez la console du navigateur
3. Vérifiez la base de données
4. Créez une issue sur GitHub

## 📄 Licence

MIT License - Libre d'utilisation et de modification.

---

**Développé avec ❤️ pour simplifier la gestion de commandes** 