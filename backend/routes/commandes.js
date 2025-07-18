const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { sendNewOrderNotification } = require('../services/email');

// Middleware pour parser le JSON
router.use(express.json());

// POST /api/commandes - Créer une nouvelle commande
router.post('/', async (req, res) => {
  try {
    const { nom, telephone, produit, adresse, quantite, notes, prix } = req.body;
    
    // Validation des données
    if (!nom || !telephone || !produit || !adresse) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }
    
    // Insérer la commande dans la base de données
    const [result] = await pool.execute(
      'INSERT INTO commandes (nom, telephone, produit, adresse, quantite, notes, prix) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, telephone, produit, adresse, quantite || 1, notes || '', prix || 0]
    );
    
    // Récupérer la commande créée
    const [commandes] = await pool.execute(
      'SELECT * FROM commandes WHERE id = ?',
      [result.insertId]
    );
    
    // Envoyer une notification email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendNewOrderNotification(commandes[0]);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // Ne pas bloquer la réponse si l'email échoue
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: commandes[0]
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// GET /api/commandes - Récupérer toutes les commandes (pour admin)
router.get('/', async (req, res) => {
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

// GET /api/commandes/:id - Récupérer une commande spécifique
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [commandes] = await pool.execute(
      'SELECT * FROM commandes WHERE id = ?',
      [id]
    );
    
    if (commandes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: commandes[0]
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération de la commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

// PATCH /api/commandes/:id - Mettre à jour le statut d'une commande
router.patch('/:id', async (req, res) => {
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

// DELETE /api/commandes/:id - Supprimer une commande
router.delete('/:id', async (req, res) => {
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

module.exports = router; 