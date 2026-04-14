#!/bin/bash

# TRQ Studio - Cloudflare Pages Deployment Script
# This script builds and deploys the website to Cloudflare Pages

set -e

echo "🚀 TRQ Studio - Cloudflare Pages Deployment"
echo "==========================================="
echo ""

# Step 1: Check Node.js
echo "✓ Checking Node.js..."
node --version
npm --version
echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Step 3: Build frontend
echo "🔨 Building frontend..."
npm run build
echo ""

# Step 4: Verify build output
echo "✓ Verifying build output..."
if [ -d "dist" ]; then
  echo "✓ Build directory created successfully"
  echo "  Files: $(find dist -type f | wc -l)"
else
  echo "✗ Build failed - dist directory not found"
  exit 1
fi
echo ""

# Step 5: Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
echo "Note: Make sure you have Cloudflare Pages connected to your Git repository"
echo "or use 'wrangler pages deploy' if you have Wrangler CLI installed"
echo ""

# Check if wrangler is installed
if command -v wrangler &> /dev/null; then
  echo "📤 Using Wrangler CLI to deploy..."
  wrangler pages deploy dist --project-name=trq-studio
else
  echo "⚠️  Wrangler CLI not found"
  echo "Please deploy using one of these methods:"
  echo "1. Push to Git and let Cloudflare Pages auto-deploy"
  echo "2. Install Wrangler: npm install -g wrangler"
  echo "3. Use Cloudflare dashboard to upload dist folder"
fi

echo ""
echo "✓ Deployment script completed!"
echo ""
echo "Next steps:"
echo "1. Verify deployment in Cloudflare Pages dashboard"
echo "2. Test admin panel at https://trq-studio.pages.dev/admin"
echo "3. Monitor error logs in Cloudflare dashboard"
echo ""
