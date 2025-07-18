# 🚀 GUIDE RAPIDE - Commande App

## ⚡ Démarrage Express

### Option 1 : Script automatique (Recommandé)
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### Option 2 : Manuel
```bash
npm install
npm start
```

## 🌐 Accès à l'application

- **Interface Client** : http://localhost:3000
- **Interface Admin** : http://localhost:3000/admin
- **Identifiants Admin** : `admin` / `admin123`

## 📋 Fonctionnalités Principales

### 🛒 Interface Client
1. **Passer une commande** : Remplissez le formulaire
2. **Validation automatique** : Les champs sont vérifiés en temps réel
3. **Confirmation** : Recevez un récapitulatif de votre commande

### 🔐 Interface Admin
1. **Connexion** : Utilisez les identifiants par défaut
2. **Dashboard** : Consultez les statistiques en temps réel
3. **Gestion** : Modifiez les statuts, supprimez des commandes
4. **Export** : Téléchargez les données en CSV

## ⚙️ Configuration

### Base de données MySQL
L'application se connecte automatiquement à MySQL avec les paramètres par défaut :
- **Host** : localhost
- **User** : root
- **Password** : (vide)
- **Database** : commande_app

### Personnalisation
1. **Produits** : Modifiez `frontend/index.html`
2. **Prix** : Modifiez `frontend/script.js`
3. **Design** : Modifiez `frontend/style.css`

## 🐛 Problèmes Courants

### Erreur de connexion MySQL
```bash
# Vérifiez que MySQL est démarré
# Windows : Services > MySQL
# Linux : sudo systemctl start mysql
```

### Port déjà utilisé
```bash
# Changez le port dans .env
PORT=3001
```

### Identifiants admin oubliés
```bash
# Supprimez le token du navigateur
# Ou redémarrez l'application
```

## 📱 Utilisation Mobile

L'application est entièrement responsive et fonctionne sur :
- 📱 Smartphones
- 📱 Tablettes
- 💻 Ordinateurs

## 🔒 Sécurité

⚠️ **IMPORTANT** : Changez les identifiants par défaut en production !

## 📞 Support

- Vérifiez les logs dans le dossier `logs/`
- Consultez la console du navigateur (F12)
- Vérifiez la base de données MySQL

---

**🎉 Votre application de gestion de commandes est prête !** 