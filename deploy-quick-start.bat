@echo off
REM TRQ Studio - Cloudflare Deployment Quick Start Script (Windows)
REM This script automates the deployment process to Cloudflare Pages

setlocal enabledelayedexpansion

REM Color codes (using findstr for colored output)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Functions
:print_header
echo.
echo %BLUE%========================================%NC%
echo %BLUE%%~1%NC%
echo %BLUE%========================================%NC%
echo.
exit /b

:print_success
echo %GREEN%[OK] %~1%NC%
exit /b

:print_error
echo %RED%[ERROR] %~1%NC%
exit /b

:print_warning
echo %YELLOW%[WARNING] %~1%NC%
exit /b

:print_info
echo %BLUE%[INFO] %~1%NC%
exit /b

REM Check prerequisites
:check_prerequisites
call :print_header "Checking Prerequisites"

where node >nul 2>nul
if errorlevel 1 (
    call :print_error "Node.js is not installed"
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
call :print_success "Node.js %NODE_VERSION% found"

where npm >nul 2>nul
if errorlevel 1 (
    call :print_error "npm is not installed"
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
call :print_success "npm %NPM_VERSION% found"

where wrangler >nul 2>nul
if errorlevel 1 (
    call :print_warning "Wrangler CLI not found globally, will use npx"
) else (
    call :print_success "Wrangler found"
)
exit /b

REM Setup environment
:setup_environment
call :print_header "Setting Up Environment"

if not exist ".env.production" (
    call :print_error ".env.production not found"
    exit /b 1
)
call :print_success ".env.production found"

REM Extract backend URL
for /f "tokens=2 delims==" %%i in ('findstr "VITE_API_URL" .env.production') do set BACKEND_URL=%%i

if "!BACKEND_URL!"=="" (
    call :print_warning "VITE_API_URL not set in .env.production"
    call :print_info "Please enter your backend URL"
    set /p BACKEND_URL="Enter backend API URL (e.g., https://api.example.com/api): "
    echo VITE_API_URL=!BACKEND_URL! >> .env.production
)

call :print_success "Backend URL: !BACKEND_URL!"
exit /b

REM Install dependencies
:install_dependencies
call :print_header "Installing Dependencies"

if exist "node_modules" (
    call :print_info "node_modules already exists, skipping npm install"
) else (
    call :print_info "Running npm install..."
    call npm install
    if errorlevel 1 (
        call :print_error "npm install failed"
        exit /b 1
    )
    call :print_success "Dependencies installed"
)
exit /b

REM Build frontend
:build_frontend
call :print_header "Building Frontend"

call :print_info "Running npm run build..."
call npm run build
if errorlevel 1 (
    call :print_error "Build failed"
    exit /b 1
)

if exist "dist" (
    call :print_success "Frontend built successfully"
) else (
    call :print_error "Build failed - dist directory not created"
    exit /b 1
)
exit /b

REM Check Wrangler authentication
:check_wrangler_auth
call :print_header "Checking Wrangler Authentication"

call npx wrangler whoami >nul 2>nul
if errorlevel 1 (
    call :print_warning "Not authenticated with Cloudflare"
    call :print_info "Running authentication..."
    call npx wrangler login
    call :print_success "Authentication complete"
) else (
    call :print_success "Authenticated with Cloudflare"
)
exit /b

REM Deploy to Cloudflare
:deploy_to_cloudflare
call :print_header "Deploying to Cloudflare Pages"

set /p DEPLOY_PROD="Deploy to production branch? (y/n): "

if /i "!DEPLOY_PROD!"=="y" (
    call :print_info "Deploying to production..."
    call npm run deploy:prod
    set DEPLOY_TYPE=production
) else (
    call :print_info "Deploying to preview..."
    call npm run deploy
    set DEPLOY_TYPE=preview
)

if errorlevel 1 (
    call :print_error "Deployment failed"
    exit /b 1
)

call :print_success "Deployment complete!"
exit /b

REM Verify deployment
:verify_deployment
call :print_header "Verifying Deployment"

call :print_info "Waiting for deployment to be live..."
timeout /t 5 /nobreak

call :print_info "Checking site status..."
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://trq-studio.pages.dev' -UseBasicParsing -TimeoutSec 10; if ($response.StatusCode -eq 200) { Write-Host 'Site is live!' } } catch { Write-Host 'Could not verify (may still be deploying)' }"

exit /b

REM Show summary
:show_summary
call :print_header "Deployment Summary"

echo.
echo Deployment completed successfully!
echo.
echo Next Steps:
echo   1. Visit: https://trq-studio.pages.dev
echo   2. Test the site functionality
echo   3. Check browser console for any errors
echo   4. Verify API calls are working
echo.
echo Useful Links:
echo   - Cloudflare Dashboard: https://dash.cloudflare.com
echo   - Pages Project: https://dash.cloudflare.com/pages
echo   - Deployment History: https://dash.cloudflare.com/pages/view/trq-studio
echo.
echo Backend Configuration:
echo   - Backend URL: !BACKEND_URL!
echo   - Make sure backend is running and accessible
echo   - Check CORS settings in server/.env
echo.
echo Troubleshooting:
echo   - CORS errors? Update CORS_ORIGINS in server/.env
echo   - API not working? Verify backend URL is correct
echo   - Build errors? Run: npm run lint
echo.
exit /b

REM Main execution
:main
call :print_header "TRQ Studio - Cloudflare Deployment"

call :check_prerequisites
if errorlevel 1 exit /b 1

call :setup_environment
if errorlevel 1 exit /b 1

call :install_dependencies
if errorlevel 1 exit /b 1

call :build_frontend
if errorlevel 1 exit /b 1

call :check_wrangler_auth
if errorlevel 1 exit /b 1

call :deploy_to_cloudflare
if errorlevel 1 exit /b 1

call :verify_deployment

call :show_summary

endlocal
