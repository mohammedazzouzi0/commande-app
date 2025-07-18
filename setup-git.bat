@echo off
echo 🚀 Configuration Git pour GitHub...
echo.

echo 📦 Initialisation du repository Git...
git init

echo.
echo 👤 Configuration de l'utilisateur Git...
echo Entrez votre nom d'utilisateur GitHub:
set /p GITHUB_USERNAME=

echo Entrez votre email GitHub:
set /p GITHUB_EMAIL=

git config user.name "%GITHUB_USERNAME%"
git config user.email "%GITHUB_EMAIL%"

echo.
echo 📝 Ajout des fichiers au repository...
git add .

echo.
echo 💾 Premier commit...
git commit -m "Initial commit: Application de gestion de commandes"

echo.
echo ✅ Configuration Git terminee!
echo.
echo 🌐 Prochaines etapes:
echo 1. Allez sur https://github.com
echo 2. Cliquez sur "New repository"
echo 3. Nommez-le "commande-app"
echo 4. Ne cochez PAS "Initialize with README"
echo 5. Cliquez "Create repository"
echo 6. Suivez les instructions pour pousser votre code
echo.
echo 📖 Instructions completes dans GITHUB_SETUP.md
pause 