const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de la connexion MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'commande_app',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig);

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Créer la base de données si elle n'existe pas
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
    // Créer la table commandes
    await connection.execute(`
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
      )
    `);
    
    // Créer la table admin
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Vérifier si l'admin existe déjà
    const [adminRows] = await connection.execute('SELECT * FROM admin WHERE username = ?', [process.env.ADMIN_USERNAME || 'admin']);
    
    if (adminRows.length === 0) {
      // Créer l'admin par défaut
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      
      await connection.execute(
        'INSERT INTO admin (username, password, email) VALUES (?, ?, ?)',
        [process.env.ADMIN_USERNAME || 'admin', hashedPassword, 'admin@example.com']
      );
      console.log('✅ Admin par défaut créé');
    }
    
    connection.release();
    console.log('✅ Base de données initialisée avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

// Fonction pour tester la connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à MySQL réussie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion MySQL:', error);
    return false;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  testConnection
}; 