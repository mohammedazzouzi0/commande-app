@echo off
echo 🚀 Preparation du deploiement...
echo.

echo 📦 Installation des dependances...
npm install

echo.
echo 🔧 Verification de la configuration...
if not exist ".env" (
    echo ❌ Fichier .env manquant!
    echo 📝 Copiez .env.example vers .env et configurez vos variables
    copy .env.example .env
    echo ✅ Fichier .env cree
) else (
    echo ✅ Fichier .env trouve
)

echo.
echo 🧪 Test local...
npm start

echo.
echo ✅ Preparation terminee!
echo.
echo 🌐 Pour deployer:
echo 1. Railway.app: https://railway.app
echo 2. Render.com: https://render.com
echo 3. DigitalOcean: https://digitalocean.com
echo.
echo 📖 Consultez DEPLOIEMENT.md pour les instructions detailees
pause 