@echo off
echo ========================================
echo    COMMANDE APP - DEMARRAGE RAPIDE
echo ========================================
echo.

echo [1/4] Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe!
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js detecte

echo.
echo [2/4] Installation des dependances...
if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        echo ERREUR: Echec de l'installation des dependances
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependances deja installees
)

echo.
echo [3/4] Configuration de la base de donnees...
echo IMPORTANT: Assurez-vous que MySQL est demarre et accessible
echo Si vous n'avez pas de fichier .env, l'application utilisera les valeurs par defaut
echo.

echo [4/4] Demarrage du serveur...
echo.
echo ========================================
echo    SERVEUR EN COURS DE DEMARRAGE...
echo ========================================
echo.
echo Interface client: http://localhost:3000
echo Interface admin:  http://localhost:3000/admin
echo API Health:       http://localhost:3000/api/health
echo.
echo Identifiants admin par defaut:
echo - Username: admin
echo - Password: admin123
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

npm start

pause 