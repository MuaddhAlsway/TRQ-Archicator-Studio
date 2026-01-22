# TRQ Studio - Cloudflare Deployment Script
param([switch]$Production = $false, [switch]$SkipBuild = $false)

Write-Host "`n=== TRQ Studio - Cloudflare Deployment ===" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Cyan
node -v | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Node.js not found" -ForegroundColor Red; exit 1 }
Write-Host "✓ Node.js $(node -v)" -ForegroundColor Green

npm -v | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: npm not found" -ForegroundColor Red; exit 1 }
Write-Host "✓ npm $(npm -v)" -ForegroundColor Green

# Setup environment
Write-Host "`nSetting up environment..." -ForegroundColor Cyan
if (-not (Test-Path ".env.production")) {
    Write-Host "ERROR: .env.production not found" -ForegroundColor Red
    exit 1
}
Write-Host "✓ .env.production found" -ForegroundColor Green

$envContent = Get-Content ".env.production"
$backendUrl = ($envContent | Select-String "VITE_API_URL" | ForEach-Object { $_.Line.Split('=')[1] }).Trim()
Write-Host "✓ Backend URL: $backendUrl" -ForegroundColor Green

# Build
if (-not $SkipBuild) {
    Write-Host "`nBuilding frontend..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Build successful" -ForegroundColor Green
}

# Deploy
Write-Host "`nDeploying to Cloudflare..." -ForegroundColor Cyan

if ($Production) {
    Write-Host "Deploying to production..." -ForegroundColor Yellow
    npm run deploy:prod
} else {
    $choice = Read-Host "Deploy to production? (y/n)"
    if ($choice -eq "y" -or $choice -eq "Y") {
        npm run deploy:prod
    } else {
        npm run deploy
    }
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Deployment complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Visit: https://trq-studio.pages.dev"
Write-Host "  2. Test the site"
Write-Host "  3. Check browser console for errors"
Write-Host "`nDashboard: https://dash.cloudflare.com/pages`n" -ForegroundColor Cyan
