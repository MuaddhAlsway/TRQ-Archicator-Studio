# Data Migration Script - SQLite to D1
# This script exports data from your current SQLite database and imports it to D1

Write-Host "🚀 Starting Data Migration..." -ForegroundColor Green
Write-Host ""

# Step 1: Export from SQLite
Write-Host "📤 Step 1: Exporting data from SQLite..." -ForegroundColor Cyan
Write-Host "   Location: server/trq.db" -ForegroundColor Gray

try {
    # Check if sqlite3 is available
    $sqlite3 = Get-Command sqlite3 -ErrorAction SilentlyContinue
    if (-not $sqlite3) {
        Write-Host "   ⚠️  sqlite3 not found. Install it or use WSL." -ForegroundColor Yellow
        Write-Host "   Skipping export. You can do this manually:" -ForegroundColor Yellow
        Write-Host "   sqlite3 server/trq.db '.dump' > backup.sql" -ForegroundColor Gray
    } else {
        # Export all data
        & sqlite3 server/trq.db ".dump" | Out-File -FilePath "backup.sql" -Encoding UTF8
        Write-Host "   ✅ Exported to backup.sql" -ForegroundColor Green
        
        # Show file size
        $fileSize = (Get-Item "backup.sql").Length / 1KB
        Write-Host "   📊 File size: $([Math]::Round($fileSize, 2)) KB" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Export failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Import to D1
Write-Host "📥 Step 2: Importing data to D1..." -ForegroundColor Cyan

if (Test-Path "backup.sql") {
    try {
        Write-Host "   🌀 Executing migration..." -ForegroundColor Gray
        
        # Run the import
        & wrangler d1 execute trq-db --file backup.sql --remote
        
        Write-Host "   ✅ Import complete!" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Import failed: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ⚠️  backup.sql not found. Create it manually:" -ForegroundColor Yellow
    Write-Host "   sqlite3 server/trq.db '.dump' > backup.sql" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# Step 3: Verify migration
Write-Host "✅ Step 3: Verifying migration..." -ForegroundColor Cyan

try {
    Write-Host "   Checking row counts..." -ForegroundColor Gray
    
    $queries = @(
        "SELECT 'projects' as table_name, COUNT(*) as count FROM projects",
        "SELECT 'hero_slides', COUNT(*) FROM hero_slides",
        "SELECT 'services', COUNT(*) FROM services",
        "SELECT 'settings', COUNT(*) FROM settings",
        "SELECT 'blog_articles', COUNT(*) FROM blog_articles"
    )
    
    foreach ($query in $queries) {
        & wrangler d1 execute trq-db --command "$query UNION ALL" --remote 2>&1 | Out-Null
    }
    
    # Final query without UNION ALL
    & wrangler d1 execute trq-db --command "SELECT 'projects' as table_name, COUNT(*) as count FROM projects UNION ALL SELECT 'hero_slides', COUNT(*) FROM hero_slides UNION ALL SELECT 'services', COUNT(*) FROM services UNION ALL SELECT 'settings', COUNT(*) FROM settings UNION ALL SELECT 'blog_articles', COUNT(*) FROM blog_articles;" --remote
    
    Write-Host "   ✅ Verification complete!" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Verification query failed (data may still be imported)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Migration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update frontend API URL in .env.production" -ForegroundColor Gray
Write-Host "   VITE_API_URL=https://trq-api.tareq-232.workers.dev/api" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test the API:" -ForegroundColor Gray
Write-Host "   curl https://trq-api.tareq-232.workers.dev/api/projects" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy frontend:" -ForegroundColor Gray
Write-Host "   npm run build && wrangler pages deploy dist" -ForegroundColor Gray
Write-Host ""
