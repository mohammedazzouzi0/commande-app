const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripe');

// Créer une session de paiement
router.post('/create-session', async (req, res) => {
  try {
    const { amount, description, currency = 'eur' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Montant invalide'
      });
    }

    const result = await stripeService.createPaymentSession(amount, currency, description);

    if (result.success) {
      res.json({
        success: true,
        sessionId: result.sessionId,
        url: result.url
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Erreur route paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Vérifier le statut d'un paiement
router.get('/verify/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await stripeService.verifyPayment(sessionId);

    if (result.success) {
      res.json({
        success: true,
        paymentStatus: result.paymentStatus,
        amount: result.amount,
        customerEmail: result.customerEmail
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// Créer un paiement direct (pour intégration frontend)
router.post('/create-payment', async (req, res) => {
  try {
    const { amount, description, currency = 'eur' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Montant invalide'
      });
    }

    const result = await stripeService.createPayment(amount, currency, description);

    if (result.success) {
      res.json({
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('Erreur création paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router; 