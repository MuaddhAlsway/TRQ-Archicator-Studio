#!/bin/bash

# Cloudflare Full Stack Deployment Script
# This script deploys both frontend and backend to Cloudflare

set -e

echo "🚀 Cloudflare Full Stack Deployment"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is authenticated
echo -e "${BLUE}Checking Cloudflare authentication...${NC}"
if ! npx wrangler whoami > /dev/null 2>&1; then
    echo -e "${YELLOW}Not authenticated. Running wrangler login...${NC}"
    npx wrangler login
fi
echo -e "${GREEN}✓ Authenticated${NC}"
echo ""

# Deploy backend
echo -e "${BLUE}Deploying Backend (Cloudflare Workers)...${NC}"
npm run deploy:worker:prod
echo -e "${GREEN}✓ Backend deployed${NC}"
echo ""

# Test backend health
echo -e "${BLUE}Testing backend health...${NC}"
WORKER_URL=$(npx wrangler deployments list --config wrangler-workers.toml --env production | head -1 | awk '{print $1}')
if [ -z "$WORKER_URL" ]; then
    WORKER_URL="https://trq-api-prod.muaddhalsway.workers.dev"
fi

HEALTH_CHECK=$(curl -s "$WORKER_URL/api/health" | grep -o '"status":"ok"' || echo "")
if [ -n "$HEALTH_CHECK" ]; then
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else
    echo -e "${YELLOW}⚠ Backend health check failed. Continuing anyway...${NC}"
fi
echo ""

# Deploy frontend
echo -e "${BLUE}Building frontend...${NC}"
npm run build
echo -e "${GREEN}✓ Frontend built${NC}"
echo ""

echo -e "${BLUE}Deploying Frontend (Cloudflare Pages)...${NC}"
npm run deploy:prod
echo -e "${GREEN}✓ Frontend deployed${NC}"
echo ""

# Summary
echo -e "${GREEN}===================================="
echo "✅ Deployment Complete!"
echo "====================================${NC}"
echo ""
echo "Frontend: https://production.trq-studio.pages.dev"
echo "Backend:  $WORKER_URL"
echo ""
echo "Next steps:"
echo "1. Visit https://production.trq-studio.pages.dev"
echo "2. Check browser console for any errors"
echo "3. Test API endpoints"
echo "4. (Optional) Set up custom domain"
echo ""
