@echo off
title DEPLOY DUBAI CONSULTAS - HEROKU
color 0A

cls
echo.
echo ========================================
echo   🚀 DEPLOY DUBAI CONSULTAS - HEROKU
echo ========================================
echo.

REM Verificar se Heroku CLI está instalado
where heroku >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Heroku CLI não encontrado!
    echo.
    echo 💡 Instale o Heroku CLI primeiro:
    echo    https://devcenter.heroku.com/articles/heroku-cli
    echo.
    echo Ou via Chocolatey:
    echo    choco install heroku-cli
    echo.
    pause
    exit /b 1
)

echo ✅ Heroku CLI encontrado
echo.

REM Verificar se está logado no Heroku
heroku auth:whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Você não está logado no Heroku
    echo Fazendo login...
    heroku login
    if %errorlevel% neq 0 (
        echo ❌ Falha no login do Heroku
        pause
        exit /b 1
    )
)

echo ✅ Logado no Heroku
echo.

REM Verificar se existe app no Heroku
heroku apps:info dubai-consultas >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Criando aplicação no Heroku...
    heroku create dubai-consultas --region us
    if %errorlevel% neq 0 (
        echo ❌ Falha ao criar aplicação no Heroku
        pause
        exit /b 1
    )
    echo ✅ Aplicação criada: dubai-consultas
) else (
    echo ✅ Aplicação já existe: dubai-consultas
)

echo.
echo 🔄 Fazendo deploy...
echo.

REM Fazer push para Heroku
git push heroku master
if %errorlevel% neq 0 (
    echo ❌ Falha no deploy
    echo.
    echo 💡 Verifique se você fez commit das mudanças:
    echo    git add .
    echo    git commit -m "Deploy message"
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOY CONCLUÍDO COM SUCESSO!
echo.
echo 🌐 Sua aplicação está rodando em:
heroku open
echo.
echo 🔗 URL da aplicação:
heroku apps:info dubai-consultas | findstr "Web URL"
echo.
echo 👤 Login: admin
echo 🔐 Senha: admin123
echo.
echo 💡 Para ver logs:
echo    heroku logs --tail --app dubai-consultas
echo.
pause
