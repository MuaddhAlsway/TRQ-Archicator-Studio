#!/bin/bash

# TRQ Studio - Cloudflare Deployment Quick Start Script
# This script automates the deployment process to Cloudflare Pages

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js $(node -v) found"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v) found"
    
    # Check wrangler
    if ! command -v wrangler &> /dev/null; then
        print_warning "Wrangler CLI not found globally, will use npx"
    else
        print_success "Wrangler $(wrangler --version) found"
    fi
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment"
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        print_error ".env.production not found"
        exit 1
    fi
    print_success ".env.production found"
    
    # Extract backend URL from .env.production
    BACKEND_URL=$(grep VITE_API_URL .env.production | cut -d '=' -f2)
    
    if [ -z "$BACKEND_URL" ]; then
        print_warning "VITE_API_URL not set in .env.production"
        print_info "Please set your backend URL:"
        read -p "Enter backend API URL (e.g., https://api.example.com/api): " BACKEND_URL
        echo "VITE_API_URL=$BACKEND_URL" >> .env.production
    fi
    
    print_success "Backend URL: $BACKEND_URL"
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    if [ -d "node_modules" ]; then
        print_info "node_modules already exists, skipping npm install"
    else
        print_info "Running npm install..."
        npm install
        print_success "Dependencies installed"
    fi
}

# Build frontend
build_frontend() {
    print_header "Building Frontend"
    
    print_info "Running npm run build..."
    npm run build
    
    if [ -d "dist" ]; then
        print_success "Frontend built successfully"
        print_info "Build output: $(du -sh dist | cut -f1)"
    else
        print_error "Build failed - dist directory not created"
        exit 1
    fi
}

# Check Wrangler authentication
check_wrangler_auth() {
    print_header "Checking Wrangler Authentication"
    
    # Try to get account info
    if npx wrangler whoami &> /dev/null; then
        ACCOUNT_INFO=$(npx wrangler whoami)
        print_success "Authenticated with Cloudflare"
        print_info "Account: $ACCOUNT_INFO"
    else
        print_warning "Not authenticated with Cloudflare"
        print_info "Running authentication..."
        npx wrangler login
        print_success "Authentication complete"
    fi
}

# Deploy to Cloudflare
deploy_to_cloudflare() {
    print_header "Deploying to Cloudflare Pages"
    
    read -p "Deploy to production branch? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deploying to production..."
        npm run deploy:prod
        DEPLOY_TYPE="production"
    else
        print_info "Deploying to preview..."
        npm run deploy
        DEPLOY_TYPE="preview"
    fi
    
    print_success "Deployment complete!"
}

# Verify deployment
verify_deployment() {
    print_header "Verifying Deployment"
    
    print_info "Waiting for deployment to be live..."
    sleep 5
    
    # Try to fetch the deployed site
    if curl -s -o /dev/null -w "%{http_code}" https://trq-studio.pages.dev | grep -q "200"; then
        print_success "Site is live at https://trq-studio.pages.dev"
    else
        print_warning "Could not verify site is live (may still be deploying)"
        print_info "Check https://dash.cloudflare.com for deployment status"
    fi
}

# Show summary
show_summary() {
    print_header "Deployment Summary"
    
    echo -e "${GREEN}Deployment completed successfully!${NC}\n"
    
    echo "📋 Next Steps:"
    echo "  1. Visit: https://trq-studio.pages.dev"
    echo "  2. Test the site functionality"
    echo "  3. Check browser console for any errors"
    echo "  4. Verify API calls are working"
    echo ""
    echo "🔗 Useful Links:"
    echo "  • Cloudflare Dashboard: https://dash.cloudflare.com"
    echo "  • Pages Project: https://dash.cloudflare.com/pages"
    echo "  • Deployment History: https://dash.cloudflare.com/pages/view/trq-studio"
    echo ""
    echo "📝 Backend Configuration:"
    echo "  • Backend URL: $BACKEND_URL"
    echo "  • Make sure backend is running and accessible"
    echo "  • Check CORS settings in server/.env"
    echo ""
    echo "🆘 Troubleshooting:"
    echo "  • CORS errors? Update CORS_ORIGINS in server/.env"
    echo "  • API not working? Verify backend URL is correct"
    echo "  • Build errors? Run: npm run lint"
    echo ""
}

# Main execution
main() {
    print_header "TRQ Studio - Cloudflare Deployment"
    
    check_prerequisites
    setup_environment
    install_dependencies
    build_frontend
    check_wrangler_auth
    deploy_to_cloudflare
    verify_deployment
    show_summary
}

# Run main function
main
