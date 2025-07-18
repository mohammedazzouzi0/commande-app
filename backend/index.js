const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initializeDatabase, testConnection } = require('./db');
const commandesRoutes = require('./routes/commandes');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting pour éviter les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});
app.use('/api/', limiter);

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes API
app.use('/api/commandes', commandesRoutes);
app.use('/api/admin', adminRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur opérationnel',
    timestamp: new Date().toISOString()
  });
});

// Route pour servir la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route pour servir la page admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Fonction pour démarrer le serveur
async function startServer() {
  try {
    // Tester la connexion à la base de données
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }
    
    // Initialiser la base de données
    await initializeDatabase();
    
    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📱 Interface client: http://localhost:${PORT}`);
      console.log(`🔐 Interface admin: http://localhost:${PORT}/admin`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer(); 