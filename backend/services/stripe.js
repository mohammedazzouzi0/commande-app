const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  // Créer une session de paiement
  async createPaymentSession(amount, currency = 'eur', description = 'Paiement commande') {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: description,
              },
              unit_amount: amount * 100, // Stripe utilise les centimes
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.error('Erreur création session Stripe:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Vérifier le statut d'un paiement
  async verifyPayment(sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return {
        success: true,
        paymentStatus: session.payment_status,
        amount: session.amount_total / 100,
        customerEmail: session.customer_details?.email
      };
    } catch (error) {
      console.error('Erreur vérification paiement:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Créer un paiement direct (pour API)
  async createPayment(amount, currency = 'eur', description = 'Paiement commande') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
        description: description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Erreur création paiement:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new StripeService(); 