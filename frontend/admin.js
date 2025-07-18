// Configuration de l'API
const API_BASE_URL = window.location.origin;

// Variables globales
let authToken = localStorage.getItem('adminToken');
let currentUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
let commandes = [];
let commandeToDelete = null;

// Éléments DOM
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const adminInfo = document.getElementById('adminInfo');

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', function() {
    if (authToken && currentUser) {
        showDashboard();
        loadStats();
        loadCommandes();
    } else {
        showLogin();
    }
});

// Gestionnaire de connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const loginData = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Sauvegarder les informations d'authentification
            authToken = result.token;
            currentUser = result.user;
            localStorage.setItem('adminToken', authToken);
            localStorage.setItem('adminUser', JSON.stringify(currentUser));
            
            showDashboard();
            loadStats();
            loadCommandes();
        } else {
            showError(result.message || 'Identifiants invalides');
        }
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showError('Erreur de connexion. Veuillez réessayer.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Fonction pour afficher le dashboard
function showDashboard() {
    loginPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    
    if (currentUser) {
        adminInfo.textContent = `Connecté en tant que ${currentUser.username}`;
    }
}

// Fonction pour afficher la page de connexion
function showLogin() {
    loginPage.style.display = 'flex';
    dashboardPage.style.display = 'none';
}

// Fonction pour se déconnecter
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    showLogin();
}

// Fonction pour charger les statistiques
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('totalCommandes').textContent = result.data.total;
            document.getElementById('enAttente').textContent = result.data.enAttente;
            document.getElementById('expediees').textContent = result.data.expediee;
            document.getElementById('aujourdhui').textContent = result.data.aujourdhui;
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Fonction pour charger les commandes
async function loadCommandes() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/commandes`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            commandes = result.data;
            renderCommandes(commandes);
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
        showError('Erreur lors du chargement des commandes');
    }
}

// Fonction pour afficher les commandes
function renderCommandes(commandesToRender) {
    const tbody = document.getElementById('commandesTableBody');
    tbody.innerHTML = '';
    
    if (commandesToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">Aucune commande trouvée</td></tr>';
        return;
    }
    
    commandesToRender.forEach(commande => {
        const row = document.createElement('tr');
        const date = new Date(commande.date_commande).toLocaleString('fr-FR');
        
        row.innerHTML = `
            <td>#${commande.id}</td>
            <td>${commande.nom}</td>
            <td>${commande.telephone}</td>
            <td>${commande.produit}</td>
            <td>${commande.quantite}</td>
            <td>${commande.prix ? commande.prix + '€' : '-'}</td>
            <td>
                <span class="status-badge ${commande.statut === 'en attente' ? 'status-pending' : 'status-shipped'}">
                    ${commande.statut}
                </span>
            </td>
            <td>${date}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewCommande(${commande.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="changeStatus(${commande.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCommande(${commande.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Fonction pour voir les détails d'une commande
async function viewCommande(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/commandes/${id}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            const commande = result.data;
            const date = new Date(commande.date_commande).toLocaleString('fr-FR');
            
            document.getElementById('commandeModalBody').innerHTML = `
                <div class="commande-details">
                    <div class="detail-item">
                        <strong>Numéro :</strong> #${commande.id}
                    </div>
                    <div class="detail-item">
                        <strong>Client :</strong> ${commande.nom}
                    </div>
                    <div class="detail-item">
                        <strong>Téléphone :</strong> ${commande.telephone}
                    </div>
                    <div class="detail-item">
                        <strong>Produit :</strong> ${commande.produit}
                    </div>
                    <div class="detail-item">
                        <strong>Quantité :</strong> ${commande.quantite}
                    </div>
                    <div class="detail-item">
                        <strong>Prix :</strong> ${commande.prix ? commande.prix + '€' : 'Non défini'}
                    </div>
                    <div class="detail-item">
                        <strong>Adresse :</strong> ${commande.adresse}
                    </div>
                    <div class="detail-item">
                        <strong>Statut :</strong> 
                        <span class="status-badge ${commande.statut === 'en attente' ? 'status-pending' : 'status-shipped'}">
                            ${commande.statut}
                        </span>
                    </div>
                    <div class="detail-item">
                        <strong>Date :</strong> ${date}
                    </div>
                    ${commande.notes ? `
                        <div class="detail-item">
                            <strong>Notes :</strong> ${commande.notes}
                        </div>
                    ` : ''}
                </div>
            `;
            
            document.getElementById('commandeModal').style.display = 'block';
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        showError('Erreur lors du chargement des détails');
    }
}

// Fonction pour changer le statut d'une commande
async function changeStatus(id) {
    const commande = commandes.find(c => c.id === id);
    if (!commande) return;
    
    const newStatus = commande.statut === 'en attente' ? 'expédiée' : 'en attente';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/commandes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ statut: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mettre à jour la liste locale
            const index = commandes.findIndex(c => c.id === id);
            if (index !== -1) {
                commandes[index] = result.data;
            }
            
            renderCommandes(commandes);
            loadStats();
            showSuccess(`Statut de la commande #${id} mis à jour`);
        } else {
            showError(result.message || 'Erreur lors de la mise à jour');
        }
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        showError('Erreur lors de la mise à jour du statut');
    }
}

// Fonction pour supprimer une commande
function deleteCommande(id) {
    commandeToDelete = id;
    document.getElementById('deleteModal').style.display = 'block';
}

// Fonction pour confirmer la suppression
async function confirmDelete() {
    if (!commandeToDelete) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/commandes/${commandeToDelete}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Supprimer de la liste locale
            commandes = commandes.filter(c => c.id !== commandeToDelete);
            renderCommandes(commandes);
            loadStats();
            showSuccess(`Commande #${commandeToDelete} supprimée`);
        } else {
            showError(result.message || 'Erreur lors de la suppression');
        }
        
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showError('Erreur lors de la suppression');
    } finally {
        closeDeleteModal();
        commandeToDelete = null;
    }
}

// Fonction pour fermer la modal de suppression
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

// Fonction pour fermer la modal de commande
function closeCommandeModal() {
    document.getElementById('commandeModal').style.display = 'none';
}

// Fonction pour actualiser les commandes
function refreshCommandes() {
    loadStats();
    loadCommandes();
}

// Fonction pour filtrer les commandes
function filterCommandes() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredCommandes = commandes;
    
    // Filtrer par statut
    if (statusFilter) {
        filteredCommandes = filteredCommandes.filter(c => c.statut === statusFilter);
    }
    
    // Filtrer par recherche
    if (searchInput) {
        filteredCommandes = filteredCommandes.filter(c => 
            c.nom.toLowerCase().includes(searchInput) ||
            c.telephone.includes(searchInput) ||
            c.produit.toLowerCase().includes(searchInput) ||
            c.id.toString().includes(searchInput)
        );
    }
    
    renderCommandes(filteredCommandes);
}

// Fonction pour exporter les commandes
function exportCommandes() {
  const csvContent = generateCSV(commandes);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `commandes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Fonction pour tester la configuration email
async function testEmail() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/test-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      showSuccess('Email de test envoyé ! Vérifiez votre boîte de réception.');
    } else {
      showError(result.message || 'Erreur lors de l\'envoi de l\'email de test');
    }
    
  } catch (error) {
    console.error('Erreur lors du test email:', error);
    showError('Erreur de connexion lors du test email');
  }
}

// Fonction pour générer le CSV
function generateCSV(commandes) {
    const headers = ['ID', 'Nom', 'Téléphone', 'Produit', 'Quantité', 'Prix', 'Adresse', 'Statut', 'Date', 'Notes'];
    const rows = commandes.map(c => [
        c.id,
        c.nom,
        c.telephone,
        c.produit,
        c.quantite,
        c.prix || '',
        c.adresse,
        c.statut,
        new Date(c.date_commande).toLocaleString('fr-FR'),
        c.notes || ''
    ]);
    
    return [headers, ...rows].map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
}

// Fonction pour afficher un message de succès
function showSuccess(message) {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Fonction pour afficher une erreur
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Fermer les modals en cliquant sur le X ou en dehors
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeCommandeModal();
        closeDeleteModal();
    });
});

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('commandeModal')) {
        closeCommandeModal();
    }
    if (e.target === document.getElementById('deleteModal')) {
        closeDeleteModal();
    }
});

// Styles CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }
    
    .notification.error {
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .commande-details {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
    }
    
    .detail-item {
        margin: 10px 0;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
    }
    
    .detail-item:last-child {
        border-bottom: none;
    }
    
    .detail-item strong {
        color: #667eea;
        min-width: 100px;
        display: inline-block;
    }
`;
document.head.appendChild(style); 