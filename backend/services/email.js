const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true pour 465, false pour les autres ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction pour envoyer une notification de nouvelle commande
async function sendNewOrderNotification(commande) {
    try {
        const date = new Date(commande.date_commande).toLocaleString('fr-FR');
        
        const mailOptions = {
            from: `"Commande App" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Vous recevez la notification
            subject: `🛒 Nouvelle commande #${commande.id} - ${commande.nom}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1>🛒 Nouvelle Commande Reçue</h1>
                        <p>Commande #${commande.id}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                        <h2>📋 Détails de la commande</h2>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <h3>👤 Informations client</h3>
                            <p><strong>Nom :</strong> ${commande.nom}</p>
                            <p><strong>Téléphone :</strong> ${commande.telephone}</p>
                            <p><strong>Adresse :</strong> ${commande.adresse}</p>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <h3>📦 Produit commandé</h3>
                            <p><strong>Produit :</strong> ${commande.produit}</p>
                            <p><strong>Quantité :</strong> ${commande.quantite}</p>
                            <p><strong>Prix :</strong> ${commande.prix ? commande.prix + '€' : 'Non défini'}</p>
                        </div>
                        
                        ${commande.notes ? `
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <h3>📝 Notes</h3>
                            <p>${commande.notes}</p>
                        </div>
                        ` : ''}
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <h3>📅 Informations</h3>
                            <p><strong>Date de commande :</strong> ${date}</p>
                            <p><strong>Statut :</strong> <span style="background: #ffc107; color: #333; padding: 3px 8px; border-radius: 12px; font-size: 12px;">En attente</span></p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                🔐 Accéder à l'interface admin
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        <p>Cet email a été envoyé automatiquement par Commande App</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de notification envoyé:', info.messageId);
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
}

// Fonction pour envoyer une notification de changement de statut
async function sendStatusUpdateNotification(commande) {
    try {
        const date = new Date(commande.date_commande).toLocaleString('fr-FR');
        const statusColor = commande.statut === 'expédiée' ? '#28a745' : '#ffc107';
        const statusText = commande.statut === 'expédiée' ? 'Expédiée' : 'En attente';
        
        const mailOptions = {
            from: `"Commande App" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `📦 Statut mis à jour - Commande #${commande.id}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1>📦 Statut de Commande Mis à Jour</h1>
                        <p>Commande #${commande.id}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; text-align: center;">
                            <h2>Nouveau statut :</h2>
                            <span style="background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 16px;">
                                ${statusText}
                            </span>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <h3>📋 Détails de la commande</h3>
                            <p><strong>Client :</strong> ${commande.nom}</p>
                            <p><strong>Produit :</strong> ${commande.produit}</p>
                            <p><strong>Quantité :</strong> ${commande.quantite}</p>
                            <p><strong>Date de commande :</strong> ${date}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="${process.env.APP_URL || 'http://localhost:3000'}/admin" 
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                                🔐 Gérer les commandes
                            </a>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email de mise à jour de statut envoyé:', info.messageId);
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi de l\'email de statut:', error);
        return false;
    }
}

// Fonction pour tester la configuration email
async function testEmailConfiguration() {
    try {
        const mailOptions = {
            from: `"Commande App" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: '🧪 Test de configuration email - Commande App',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px;">
                        <h1>🧪 Test de Configuration</h1>
                        <p>L'envoi d'email fonctionne correctement !</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px;">
                        <p>✅ Votre configuration email est opérationnelle.</p>
                        <p>Vous recevrez maintenant des notifications pour chaque nouvelle commande.</p>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                            <h3>Configuration actuelle :</h3>
                            <p><strong>Serveur SMTP :</strong> ${process.env.EMAIL_HOST}</p>
                            <p><strong>Port :</strong> ${process.env.EMAIL_PORT}</p>
                            <p><strong>Email :</strong> ${process.env.EMAIL_USER}</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Test email envoyé avec succès:', info.messageId);
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors du test email:', error);
        return false;
    }
}

module.exports = {
    sendNewOrderNotification,
    sendStatusUpdateNotification,
    testEmailConfiguration
}; 