-- Script de configuration pour Commande App
-- Exécutez ce script dans MySQL pour créer la base de données

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS commande_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE commande_app;

-- Créer la table commandes
CREATE TABLE IF NOT EXISTS commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    produit VARCHAR(200) NOT NULL,
    adresse TEXT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    statut ENUM('en attente', 'expédiée') DEFAULT 'en attente',
    date_commande TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    prix DECIMAL(10,2) DEFAULT 0.00
);

-- Créer la table admin
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer l'admin par défaut (mot de passe: admin123)
-- Note: Le mot de passe sera hashé automatiquement par l'application
INSERT IGNORE INTO admin (username, password, email) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com');

-- Créer quelques commandes d'exemple
INSERT INTO commandes (nom, telephone, produit, adresse, quantite, prix, notes) VALUES
('Jean Dupont', '0123456789', 'Produit A', '123 Rue de la Paix, 75001 Paris', 2, 100.00, 'Livraison en matinée'),
('Marie Martin', '0987654321', 'Produit B', '456 Avenue des Champs, 69000 Lyon', 1, 75.00, ''),
('Pierre Durand', '0555666777', 'Produit C', '789 Boulevard Central, 13000 Marseille', 3, 300.00, 'Urgent');

-- Afficher les tables créées
SHOW TABLES;

-- Afficher la structure des tables
DESCRIBE commandes;
DESCRIBE admin;

-- Afficher les données d'exemple
SELECT * FROM commandes;
SELECT id, username, email, created_at FROM admin; 