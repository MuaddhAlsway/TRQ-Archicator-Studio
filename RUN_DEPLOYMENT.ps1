# Cloudflare Workers + R2 Deployment Script
# Run this after completing Cloudflare setup

Write-Host "🚀 TRQ Studio Deployment to Cloudflare Workers + R2" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if environment variables are set
Write-Host "📋 Checking environment variables..." -ForegroundColor Yellow

if (-not $env:CLOUDFLARE_ACCOUNT_ID) {
    Write-Host "❌ CLOUDFLARE_ACCOUNT_ID not set" -ForegroundColor Red
    Write-Host "   Run: `$env:CLOUDFLARE_ACCOUNT_ID = 'your-account-id'" -ForegroundColor Gray
    exit 1
}

if (-not $env:CLOUDFLARE_R2_ACCESS_KEY_ID) {
    Write-Host "❌ CLOUDFLARE_R2_ACCESS_KEY_ID not set" -ForegroundColor Red
    Write-Host "   Run: `$env:CLOUDFLARE_R2_ACCESS_KEY_ID = 'your-access-key'" -ForegroundColor Gray
    exit 1
}

if (-not $env:CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    Write-Host "❌ CLOUDFLARE_R2_SECRET_ACCESS_KEY not set" -ForegroundColor Red
    Write-Host "   Run: `$env:CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'your-secret-key'" -ForegroundColor Gray
    exit 1
}

Write-Host "✓ CLOUDFLARE_ACCOUNT_ID: $($env:CLOUDFLARE_ACCOUNT_ID.Substring(0, 8))..." -ForegroundColor Green
Write-Host "✓ CLOUDFLARE_R2_ACCESS_KEY_ID: $($env:CLOUDFLARE_R2_ACCESS_KEY_ID.Substring(0, 8))..." -ForegroundColor Green
Write-Host "✓ CLOUDFLARE_R2_SECRET_ACCESS_KEY: (set)" -ForegroundColor Green
Write-Host ""

# Step 1: Build
Write-Host "📦 Step 1: Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build complete" -ForegroundColor Green
Write-Host ""

# Step 2: Upload to R2
Write-Host "📤 Step 2: Uploading images to R2..." -ForegroundColor Yellow
node upload-to-r2.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Upload failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Upload complete" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy Worker
Write-Host "🚀 Step 3: Deploying to Cloudflare Workers..." -ForegroundColor Yellow
wrangler deploy --env production
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Deployment complete" -ForegroundColor Green
Write-Host ""

# Success
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your site is now live at:" -ForegroundColor Cyan
Write-Host "  https://trq-studio.pages.dev" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Visit https://trq-studio.pages.dev" -ForegroundColor Gray
Write-Host "  2. Check that images load" -ForegroundColor Gray
Write-Host "  3. Test API calls" -ForegroundColor Gray
Write-Host "  4. Monitor at https://dash.cloudflare.com" -ForegroundColor Gray
Write-Host ""
