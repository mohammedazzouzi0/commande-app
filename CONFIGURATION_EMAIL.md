# 📧 Configuration Email - Commande App

## 🎯 Fonctionnalités Email

L'application peut maintenant envoyer des notifications email automatiques pour :

- ✅ **Nouvelles commandes** : Email détaillé à chaque nouvelle commande
- ✅ **Changements de statut** : Notification quand une commande passe à "expédiée"
- ✅ **Test de configuration** : Vérifier que l'envoi d'email fonctionne

## ⚙️ Configuration Gmail (Recommandé)

### 1. Activer l'authentification à 2 facteurs
1. Allez sur https://myaccount.google.com/security
2. Activez la "Validation en 2 étapes"

### 2. Créer un mot de passe d'application
1. Allez sur https://myaccount.google.com/apppasswords
2. Sélectionnez "Mail" et votre appareil
3. Cliquez sur "Générer"
4. Copiez le mot de passe généré (16 caractères)

### 3. Configurer le fichier .env
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app_16_caracteres
APP_URL=http://localhost:3000
```

## 🔧 Configuration Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=votre_email@outlook.com
EMAIL_PASS=votre_mot_de_passe
APP_URL=http://localhost:3000
```

## 🔧 Configuration Yahoo

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=votre_email@yahoo.com
EMAIL_PASS=votre_mot_de_passe_app
APP_URL=http://localhost:3000
```

## 🧪 Tester la Configuration

### Option 1 : Interface Admin
1. Connectez-vous à http://localhost:3000/admin
2. Cliquez sur le bouton "Test Email"
3. Vérifiez votre boîte de réception

### Option 2 : API Directe
```bash
curl -X POST http://localhost:3000/api/admin/test-email \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT" \
  -H "Content-Type: application/json"
```

## 📧 Exemples d'Emails

### Email de Nouvelle Commande
```
🛒 Nouvelle commande #123 - Jean Dupont

📋 Détails de la commande
👤 Informations client
   Nom : Jean Dupont
   Téléphone : 0123456789
   Adresse : 123 Rue de la Paix, Paris

📦 Produit commandé
   Produit : Produit A
   Quantité : 2
   Prix : 100€

📅 Informations
   Date de commande : 15/12/2023 14:30
   Statut : En attente

🔐 Accéder à l'interface admin
```

### Email de Changement de Statut
```
📦 Statut mis à jour - Commande #123

Nouveau statut : Expédiée

📋 Détails de la commande
   Client : Jean Dupont
   Produit : Produit A
   Quantité : 2
   Date de commande : 15/12/2023 14:30

🔐 Gérer les commandes
```

## 🐛 Dépannage

### Erreur "Invalid login"
- Vérifiez que l'authentification à 2 facteurs est activée
- Utilisez un mot de passe d'application, pas votre mot de passe principal

### Erreur "Connection timeout"
- Vérifiez que le port 587 n'est pas bloqué par votre pare-feu
- Essayez le port 465 avec `secure: true`

### Erreur "Authentication failed"
- Vérifiez vos identifiants email
- Assurez-vous que l'email et le mot de passe sont corrects

### Erreur "Rate limit exceeded"
- Gmail limite à 500 emails par jour
- Attendez 24h ou utilisez un autre service

## 🔒 Sécurité

### Recommandations
- ✅ Utilisez toujours un mot de passe d'application
- ✅ Ne partagez jamais vos identifiants
- ✅ Changez régulièrement vos mots de passe
- ✅ Utilisez HTTPS en production

### Variables sensibles
- `EMAIL_USER` : Votre adresse email
- `EMAIL_PASS` : Votre mot de passe d'application

## 📱 Notifications Push (Alternative)

Si vous préférez les notifications push, vous pouvez également :

1. **Configurer un webhook Telegram**
2. **Utiliser Discord webhooks**
3. **Intégrer Slack notifications**

## 🚀 Déploiement Production

### Variables d'environnement
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
APP_URL=https://votre-domaine.com
NODE_ENV=production
```

### Vérifications
- ✅ Configuration email testée
- ✅ Variables d'environnement sécurisées
- ✅ SSL/TLS activé
- ✅ Rate limiting configuré

---

**📧 Votre système de notifications email est maintenant configuré !** 