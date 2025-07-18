# 🚀 Guide de Déploiement - Application de Gestion de Commandes

## 📋 Prérequis
- Compte GitHub
- Code source de l'application
- Base de données MySQL (locale ou cloud)

---

## 🌐 Option 1: Railway.app (Recommandé - Gratuit)

### Étape 1: Préparation
1. Créez un compte sur [Railway.app](https://railway.app)
2. Connectez votre compte GitHub

### Étape 2: Déploiement
1. Cliquez sur "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez votre repository
4. Railway détectera automatiquement que c'est une app Node.js

### Étape 3: Configuration Base de Données
1. Dans votre projet Railway, cliquez sur "New"
2. Sélectionnez "Database" → "MySQL"
3. Railway créera automatiquement les variables d'environnement

### Étape 4: Variables d'Environnement
Dans les paramètres de votre projet, configurez :
```env
DB_HOST=your-railway-mysql-host
DB_USER=your-railway-mysql-user
DB_PASSWORD=your-railway-mysql-password
DB_NAME=your-railway-mysql-database
DB_PORT=3306
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=votre_secret_jwt_tres_securise
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
PORT=3000
NODE_ENV=production
```

### Étape 5: Déploiement
1. Railway déploiera automatiquement à chaque push sur GitHub
2. Votre app sera accessible via l'URL fournie par Railway

---

## 🌐 Option 2: Render.com (Gratuit)

### Étape 1: Préparation
1. Créez un compte sur [Render.com](https://render.com)
2. Connectez votre compte GitHub

### Étape 2: Créer un Web Service
1. Cliquez sur "New" → "Web Service"
2. Connectez votre repository GitHub
3. Configurez :
   - **Name**: commande-app
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Étape 3: Base de Données PostgreSQL
1. Créez un "PostgreSQL" service
2. Render fournira automatiquement les variables d'environnement

### Étape 4: Variables d'Environnement
Configurez les variables dans votre Web Service :
```env
DB_HOST=your-render-postgres-host
DB_USER=your-render-postgres-user
DB_PASSWORD=your-render-postgres-password
DB_NAME=your-render-postgres-database
DB_PORT=5432
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=votre_secret_jwt_tres_securise
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
PORT=10000
NODE_ENV=production
```

---

## 🌐 Option 3: DigitalOcean App Platform

### Étape 1: Préparation
1. Créez un compte DigitalOcean
2. Allez dans "Apps" → "Create App"

### Étape 2: Configuration
1. Connectez votre repository GitHub
2. Sélectionnez la branche (main/master)
3. DigitalOcean détectera automatiquement Node.js

### Étape 3: Base de Données
1. Ajoutez un "Database" component
2. Choisissez MySQL
3. DigitalOcean créera automatiquement les variables

### Étape 4: Variables d'Environnement
Configurez dans l'interface DigitalOcean :
```env
DB_HOST=${db.DATABASE_HOST}
DB_USER=${db.DATABASE_USERNAME}
DB_PASSWORD=${db.DATABASE_PASSWORD}
DB_NAME=${db.DATABASE_NAME}
DB_PORT=${db.DATABASE_PORT}
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=votre_secret_jwt_tres_securise
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
PORT=8080
NODE_ENV=production
```

---

## 🌐 Option 4: VPS (DigitalOcean Droplet)

### Étape 1: Créer un Droplet
1. Créez un Droplet Ubuntu 22.04
2. Choisissez un plan (minimum $5/mois)

### Étape 2: Configuration Serveur
```bash
# Connexion SSH
ssh root@votre_ip

# Mise à jour
sudo apt update && sudo apt upgrade -y

# Installation Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Installation PM2
sudo npm install -g pm2

# Installation Nginx
sudo apt install nginx -y
```

### Étape 3: Configuration Base de Données
```sql
CREATE DATABASE commande_app;
CREATE USER 'commande_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON commande_app.* TO 'commande_user'@'localhost';
FLUSH PRIVILEGES;
```

### Étape 4: Déploiement Application
```bash
# Cloner le repository
git clone https://github.com/votre-username/votre-repo.git
cd votre-repo

# Installation dépendances
npm install

# Configuration environnement
cp .env.example .env
nano .env  # Éditer avec vos paramètres

# Démarrage avec PM2
pm2 start backend/index.js --name "commande-app"
pm2 startup
pm2 save
```

### Étape 5: Configuration Nginx
```bash
sudo nano /etc/nginx/sites-available/commande-app
```

Contenu :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/commande-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🌐 Option 5: Hébergement Web Traditionnel

### Fournisseurs Recommandés
- **OVH** (à partir de 3€/mois)
- **Hostinger** (à partir de 2€/mois)
- **InfinityFree** (gratuit)

### Étapes Générales
1. Achetez un plan d'hébergement avec support Node.js
2. Créez une base de données MySQL
3. Uploadez vos fichiers via FTP/SFTP
4. Configurez les variables d'environnement
5. Démarrez l'application

---

## 🔧 Configuration Post-Déploiement

### 1. Test de l'Application
- Vérifiez que l'API fonctionne : `https://votre-domaine.com/api/health`
- Testez l'interface client : `https://votre-domaine.com`
- Testez l'interface admin : `https://votre-domaine.com/admin`

### 2. Sécurité
- Changez le mot de passe admin par défaut
- Utilisez un JWT_SECRET fort
- Configurez HTTPS (automatique sur Railway/Render)
- Limitez les accès à la base de données

### 3. Monitoring
- Configurez des logs
- Surveillez les performances
- Mettez en place des alertes

---

## 🆘 Dépannage

### Erreurs Communes
1. **Port non disponible** : Vérifiez la variable PORT
2. **Connexion base de données** : Vérifiez les credentials
3. **Email non envoyé** : Vérifiez la configuration SMTP
4. **CORS errors** : Configurez les domaines autorisés

### Logs
- Railway/Render : Interface web
- VPS : `pm2 logs commande-app`
- Hébergement web : Panneau de contrôle

---

## 💡 Recommandations

### Pour Débuter
- **Railway.app** : Simple, gratuit, automatique
- **Render.com** : Alternative gratuite fiable

### Pour Production
- **DigitalOcean App Platform** : Performance, scalabilité
- **VPS** : Contrôle total, plus complexe

### Pour Budget Limité
- **InfinityFree** : Gratuit, limitations
- **Railway/Render** : Plans gratuits généreux

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs de l'application
2. Consultez la documentation du fournisseur
3. Vérifiez la configuration des variables d'environnement
4. Testez localement avant de déployer 