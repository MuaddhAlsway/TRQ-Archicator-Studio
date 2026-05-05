Write-Host "Deploying to Cloudflare Pages..." -ForegroundColor Cyan

if (-not (Test-Path "dist")) {
    Write-Host "dist folder not found. Run npm run build first." -ForegroundColor Red
    exit 1
}

$fileCount = (Get-ChildItem dist -Recurse | Measure-Object).Count
Write-Host "Found $fileCount files to deploy" -ForegroundColor Yellow

Write-Host "Uploading to trq-studio-github..." -ForegroundColor Yellow
wrangler pages deploy dist --project-name trq-studio-github --branch main --commit-dirty=true

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site is live at:" -ForegroundColor Cyan
    Write-Host "  https://trq-studio-github.pages.dev" -ForegroundColor Green
    Write-Host ""
    Write-Host "API is at:" -ForegroundColor Cyan
    Write-Host "  https://trq-api-production.tareq-232.workers.dev/api" -ForegroundColor Green
} else {
    Write-Host "Deployment failed" -ForegroundColor Red
    exit 1
}
