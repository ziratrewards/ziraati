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

echo [1/9] Checking GitHub login...

gh auth status >nul 2>&1

if errorlevel 1 (
    echo GitHub login required.
    gh auth login

    if errorlevel 1 (
        echo [ERROR] GitHub login failed.
        pause
        exit /b 1
    )
)

echo.
echo [2/9] Getting GitHub username...

for /f "delims=" %%A in ('gh api user --jq ".login"') do set USERNAME=%%A

echo GitHub User: !USERNAME!

echo.
set /p REPONAME=Enter GitHub repository name: 

if "!REPONAME!"=="" (
    echo [ERROR] Repository name cannot be empty.
    pause
    exit /b 1
)

set "REPO=!USERNAME!/!REPONAME!"
set "REMOTE=https://github.com/!USERNAME!/!REPONAME!.git"

echo.
echo Repository:
echo !REPO!

echo.
echo [3/9] Checking repository...

gh repo view "!REPO!" >nul 2>&1

if errorlevel 1 (
    echo Repository does not exist.
    echo Creating repository...

    gh repo create "!REPO!" --public

    if errorlevel 1 (
        echo [ERROR] Failed to create repository.
        pause
        exit /b 1
    )

    echo Repository created successfully.
) else (
    echo Repository already exists.
    echo Using existing repository.
)

echo.
echo [4/9] Configuring Git...

if not exist .git (
    git init
)

git branch -M main

git remote get-url origin >nul 2>&1

if errorlevel 1 (
    git remote add origin "!REMOTE!"
) else (
    git remote set-url origin "!REMOTE!"
)

echo Remote:
git remote -v

echo.
echo [5/9] Creating .gitignore...

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
echo [6/9] Preparing source code...

git add .

git diff --cached --quiet

if errorlevel 1 (
    git commit -m "Update Angular application"
) else (
    echo No new changes to commit.
)

echo.
echo [7/9] Pushing source code...

git pull origin main --allow-unrelated-histories --no-edit >nul 2>&1

git push -u origin main

if errorlevel 1 (
    echo.
    echo [ERROR] Git push failed.
    echo.
    echo Check:
    echo - GitHub authentication
    echo - Repository permissions
    echo - Remote URL
    pause
    exit /b 1
)

echo.
echo [8/9] Creating GitHub Pages workflow...

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
echo Workflow created.

echo.
echo [9/9] Uploading deployment workflow...

git add .github\workflows\deploy.yml

git diff --cached --quiet

if errorlevel 1 (
    git commit -m "Configure GitHub Pages deployment"
    git push origin main
) else (
    echo Workflow already up to date.
)

echo.
echo Configuring GitHub Pages...

gh api --method PUT "repos/!USERNAME!/!REPONAME!/pages" ^
    -f "build_type=workflow" >nul 2>&1

echo.
echo ========================================
echo              DEPLOY STARTED
echo ========================================
echo.
echo Repository:
echo https://github.com/!USERNAME!/!REPONAME!
echo.
echo Website:
echo https://!USERNAME!.github.io/!REPONAME!/
echo.
echo GitHub Actions:
echo https://github.com/!USERNAME!/!REPONAME!/actions
echo.

echo Waiting for GitHub Actions...
timeout /t 5 /nobreak >nul

echo.
echo Latest workflow runs:
echo.

gh run list --repo "!REPO!" --limit 5

echo.
echo ========================================
echo              FINISHED
echo ========================================
echo.
echo Open:
echo https://!USERNAME!.github.io/!REPONAME!/
echo.

pause