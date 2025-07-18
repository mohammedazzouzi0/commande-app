#!/bin/bash

echo "========================================"
echo "   COMMANDE APP - DEMARRAGE RAPIDE"
echo "========================================"
echo

echo "[1/4] Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERREUR: Node.js n'est pas installé!"
    echo "Veuillez installer Node.js depuis https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js détecté"

echo
echo "[2/4] Installation des dépendances..."
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "ERREUR: Échec de l'installation des dépendances"
        exit 1
    fi
else
    echo "✓ Dépendances déjà installées"
fi

echo
echo "[3/4] Configuration de la base de données..."
echo "IMPORTANT: Assurez-vous que MySQL est démarré et accessible"
echo "Si vous n'avez pas de fichier .env, l'application utilisera les valeurs par défaut"
echo

echo "[4/4] Démarrage du serveur..."
echo
echo "========================================"
echo "   SERVEUR EN COURS DE DÉMARRAGE..."
echo "========================================"
echo
echo "Interface client: http://localhost:3000"
echo "Interface admin:  http://localhost:3000/admin"
echo "API Health:       http://localhost:3000/api/health"
echo
echo "Identifiants admin par défaut:"
echo "- Username: admin"
echo "- Password: admin123"
echo
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo

npm start 