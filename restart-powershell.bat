@echo off
echo 🔄 Redemarrage de PowerShell avec Git...
echo.

echo 📦 Ajout de Git au PATH...
setx PATH "%PATH%;C:\Program Files\Git\bin" /M

echo.
echo ✅ Git ajoute au PATH systeme
echo.
echo 🚀 Redemarrage de PowerShell...
echo Fermez cette fenetre et ouvrez une nouvelle PowerShell
echo.
echo 📖 Ensuite, suivez le guide GITHUB_SETUP.md
pause 