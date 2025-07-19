# Image de base Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances de production
RUN npm ci --only=production

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 3000

# Variable d'environnement pour le port
ENV PORT=3000

# Commande de démarrage
CMD ["npm", "start"] 