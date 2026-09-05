@echo off
setlocal enabledelayedexpansion

echo ========================================
echo       Angular GitHub Pages Deploy
echo ========================================
echo.

where gh >nul 2>&1
if errorlevel 1 (
    echo [ERROR] GitHub CLI is not installed.
    pause
    exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed.
    pause
    exit /b 1
)

if not exist package.json (
    echo [ERROR] package.json not found.
    echo Run this file from the Angular project root.
    pause
    exit /b 1
)

if not exist angular.json (
    echo [ERROR] angular.json not found.
    echo This does not look like an Angular project.
    pause
    exit /b 1
)

echo [1/8] Checking GitHub login...
gh auth status >nul 2>&1
if errorlevel 1 (
    echo GitHub login required.
    gh auth login
    if errorlevel 1 exit /b 1
)

echo.
echo [2/8] Getting GitHub username...
for /f "delims=" %%A in ('gh api user --jq ".login"') do set USERNAME=%%A

echo GitHub User: !USERNAME!

echo.
set /p REPONAME=Enter new GitHub repository name: 

if "!REPONAME!"=="" (
    echo [ERROR] Repository name cannot be empty.
    pause
    exit /b 1
)

echo.
echo [3/8] Creating .gitignore...

if not exist .gitignore (
    (
        echo node_modules/
        echo dist/
        echo .angular/
        echo .env
        echo .env.*
        echo !.env.example
        echo coverage/
        echo .DS_Store
        echo *.log
    ) > .gitignore
)

echo.
echo [4/8] Initializing Git...

if not exist .git (
    git init
)

git branch -M main

git add .

git commit -m "Initial commit"

echo.
echo [5/8] Creating GitHub repository...

gh repo create "!USERNAME!/!REPONAME!" --public --source=. --remote=origin --push

if errorlevel 1 (
    echo.
    echo [ERROR] Failed to create or push repository.
    pause
    exit /b 1
)

echo.
echo [6/8] Creating GitHub Pages workflow...

if not exist .github\workflows mkdir .github\workflows

(
echo name: Deploy Angular to GitHub Pages
echo.
echo on:
echo   push:
echo     branches:
echo       - main
echo   workflow_dispatch:
echo.
echo permissions:
echo   contents: read
echo   pages: write
echo   id-token: write
echo.
echo concurrency:
echo   group: pages
echo   cancel-in-progress: true
echo.
echo jobs:
echo   build:
echo     runs-on: ubuntu-latest
echo.
echo     steps:
echo       - name: Checkout
echo         uses: actions/checkout@v4
echo.
echo       - name: Setup Node
echo         uses: actions/setup-node@v4
echo         with:
echo           node-version: 22
echo           cache: npm
echo.
echo       - name: Install dependencies
echo         run: npm ci
echo.
echo       - name: Build Angular
echo         run: npm run build -- --base-href /!REPONAME!/
echo.
echo       - name: Setup Pages
echo         uses: actions/configure-pages@v5
echo.
echo       - name: Upload Pages Artifact
echo         uses: actions/upload-pages-artifact@v3
echo         with:
echo           path: ./dist/frontend/browser
echo.
echo   deploy:
echo     environment:
echo       name: github-pages
echo       url: ${{ steps.deployment.outputs.page_url }}
echo.
echo     runs-on: ubuntu-latest
echo     needs: build
echo.
echo     steps:
echo       - name: Deploy to GitHub Pages
echo         id: deployment
echo         uses: actions/deploy-pages@v4
) > .github\workflows\deploy.yml

echo.
echo [7/8] Pushing workflow...

git add .github\workflows\deploy.yml
git commit -m "Add GitHub Pages deployment"
git push origin main

echo.
echo [8/8] Configuring GitHub Pages...

gh api --method PUT repos/!USERNAME!/!REPONAME!/pages ^
    -f "build_type=workflow" >nul 2>&1

echo.
echo ========================================
echo              DONE
echo ========================================
echo.
echo Repository:
echo https://github.com/!USERNAME!/!REPONAME!
echo.
echo GitHub Pages:
echo https://!USERNAME!.github.io/!REPONAME!/
echo.
echo Checking workflow...
echo.

timeout /t 5 /nobreak >nul

gh run list --repo "!USERNAME!/!REPONAME!" --limit 3

echo.
echo ========================================
echo The GitHub Action will build and deploy
echo your Angular application automatically.
echo ========================================
echo.

pause