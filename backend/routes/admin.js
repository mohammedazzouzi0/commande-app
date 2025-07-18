const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { sendStatusUpdateNotification, testEmailConfiguration } = require('../services/email');

// Middleware pour parser le JSON
router.use(express.json());

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'accès requis'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalide'
      });
    }
    req.user = user;
    next();
  });
};

// POST /api/admin/login - Connexion admin
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nom d\'utilisateur et mot de passe requis'
      });
    }
    
    // Vérifier les identifiants dans la base de données
    const [admins] = await pool.execute(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );
    
    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
    
    const admin = admins[0];
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// GET /api/admin/profile - Récupérer le profil admin
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [admins] = await pool.execute(
      'SELECT id, username, email, created_at FROM admin WHERE id = ?',
      [req.user.id]
    );
    
    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: admins[0]
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// GET /api/admin/commandes - Récupérer toutes les commandes (protégé)
router.get('/commandes', authenticateToken, async (req, res) => {
  try {
    const [commandes] = await pool.execute(
      'SELECT * FROM commandes ORDER BY date_commande DESC'
    );
    
    res.json({
      success: true,
      data: commandes
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// PATCH /api/admin/commandes/:id - Mettre à jour le statut d'une commande (protégé)
router.patch('/commandes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    
    if (!statut || !['en attente', 'expédiée'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide. Doit être "en attente" ou "expédiée"'
      });
    }
    
    const [result] = await pool.execute(
      'UPDATE commandes SET statut = ? WHERE id = ?',
      [statut, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    // Récupérer la commande mise à jour
    const [commandes] = await pool.execute(
      'SELECT * FROM commandes WHERE id = ?',
      [id]
    );
    
    // Envoyer une notification email de changement de statut
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendStatusUpdateNotification(commandes[0]);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de statut:', emailError);
        // Ne pas bloquer la réponse si l'email échoue
      }
    }
    
    res.json({
      success: true,
      message: 'Statut de la commande mis à jour',
      data: commandes[0]
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// DELETE /api/admin/commandes/:id - Supprimer une commande (protégé)
router.delete('/commandes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute(
      'DELETE FROM commandes WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Commande supprimée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// GET /api/admin/stats - Statistiques des commandes (protégé)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Total des commandes
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM commandes');
    const total = totalResult[0].total;
    
    // Commandes en attente
    const [enAttenteResult] = await pool.execute('SELECT COUNT(*) as en_attente FROM commandes WHERE statut = "en attente"');
    const enAttente = enAttenteResult[0].en_attente;
    
    // Commandes expédiées
    const [expedieeResult] = await pool.execute('SELECT COUNT(*) as expediee FROM commandes WHERE statut = "expédiée"');
    const expediee = expedieeResult[0].expediee;
    
    // Commandes du jour
    const [aujourdhuiResult] = await pool.execute('SELECT COUNT(*) as aujourdhui FROM commandes WHERE DATE(date_commande) = CURDATE()');
    const aujourdhui = aujourdhuiResult[0].aujourdhui;
    
    res.json({
      success: true,
      data: {
        total,
        enAttente,
        expediee,
        aujourdhui
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// POST /api/admin/test-email - Tester la configuration email (protégé)
router.post('/test-email', authenticateToken, async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({
        success: false,
        message: 'Configuration email manquante. Vérifiez vos variables d\'environnement.'
      });
    }
    
    const emailSent = await testEmailConfiguration();
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'Email de test envoyé avec succès. Vérifiez votre boîte de réception.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de test'
      });
    }
    
  } catch (error) {
    console.error('Erreur lors du test email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

module.exports = router; 