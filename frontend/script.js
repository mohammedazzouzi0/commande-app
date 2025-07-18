// Configuration de l'API
const API_BASE_URL = window.location.origin;

// Éléments DOM
const commandeForm = document.getElementById('commandeForm');
const confirmationModal = document.getElementById('confirmationModal');
const errorModal = document.getElementById('errorModal');
const commandeDetails = document.getElementById('commandeDetails');
const errorMessage = document.getElementById('errorMessage');

// Gestionnaire de soumission du formulaire
commandeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(commandeForm);
    const commandeData = {
        nom: formData.get('nom'),
        telephone: formData.get('telephone'),
        produit: formData.get('produit'),
        quantite: parseInt(formData.get('quantite')) || 1,
        prix: parseFloat(formData.get('prix')) || 0,
        adresse: formData.get('adresse'),
        notes: formData.get('notes') || ''
    };
    
    // Validation des données
    if (!commandeData.nom || !commandeData.telephone || !commandeData.produit || !commandeData.adresse) {
        showError('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Désactiver le bouton pendant l'envoi
    const submitBtn = commandeForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
        // Envoyer la commande
        const response = await fetch(`${API_BASE_URL}/api/commandes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commandeData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Afficher la confirmation
            showConfirmation(result.data);
            // Réinitialiser le formulaire
            commandeForm.reset();
        } else {
            showError(result.message || 'Erreur lors de l\'envoi de la commande.');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion. Veuillez réessayer.');
    } finally {
        // Réactiver le bouton
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Fonction pour afficher la confirmation
function showConfirmation(commande) {
    const date = new Date(commande.date_commande).toLocaleString('fr-FR');
    
    commandeDetails.innerHTML = `
        <div class="commande-summary">
            <h4>Récapitulatif de votre commande :</h4>
            <div class="summary-item">
                <strong>Numéro :</strong> #${commande.id}
            </div>
            <div class="summary-item">
                <strong>Client :</strong> ${commande.nom}
            </div>
            <div class="summary-item">
                <strong>Produit :</strong> ${commande.produit}
            </div>
            <div class="summary-item">
                <strong>Quantité :</strong> ${commande.quantite}
            </div>
            ${commande.prix > 0 ? `<div class="summary-item"><strong>Prix :</strong> ${commande.prix}€</div>` : ''}
            <div class="summary-item">
                <strong>Date :</strong> ${date}
            </div>
        </div>
    `;
    
    confirmationModal.style.display = 'block';
}

// Fonction pour afficher une erreur
function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

// Fonction pour fermer la modal de confirmation
function closeModal() {
    confirmationModal.style.display = 'none';
}

// Fonction pour fermer la modal d'erreur
function closeErrorModal() {
    errorModal.style.display = 'none';
}

// Fermer les modals en cliquant sur le X ou en dehors
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeModal();
        closeErrorModal();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
        closeModal();
    }
    if (e.target === errorModal) {
        closeErrorModal();
    }
});

// Gestionnaire pour le changement de produit
document.getElementById('produit').addEventListener('change', function() {
    const produit = this.value;
    const prixInput = document.getElementById('prix');
    
    // Définir le prix automatiquement selon le produit
    const prixMap = {
        'Produit A': 50,
        'Produit B': 75,
        'Produit C': 100,
        'Produit D': 125
    };
    
    if (prixMap[produit]) {
        prixInput.value = prixMap[produit];
    } else if (produit === 'Autre') {
        prixInput.value = '';
        prixInput.placeholder = 'Entrez le prix';
    }
});

// Validation du téléphone
document.getElementById('telephone').addEventListener('input', function() {
    // Supprimer tous les caractères non numériques sauf +, -, ( et )
    this.value = this.value.replace(/[^\d+\-\(\)\s]/g, '');
});

// Validation de la quantité
document.getElementById('quantite').addEventListener('input', function() {
    const value = parseInt(this.value);
    if (value < 1) {
        this.value = 1;
    }
});

// Validation du prix
document.getElementById('prix').addEventListener('input', function() {
    const value = parseFloat(this.value);
    if (value < 0) {
        this.value = 0;
    }
});

// Animation d'entrée pour les éléments
document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    const infoPanel = document.querySelector('.info-panel');
    
    // Animation d'entrée
    setTimeout(() => {
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        infoPanel.style.opacity = '1';
        infoPanel.style.transform = 'translateY(0)';
    }, 200);
});

// Styles CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    .form-container, .info-panel {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .commande-summary {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin: 15px 0;
    }
    
    .summary-item {
        margin: 8px 0;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
    }
    
    .summary-item:last-child {
        border-bottom: none;
    }
    
    .summary-item strong {
        color: #667eea;
        min-width: 80px;
        display: inline-block;
    }
`;
document.head.appendChild(style); 