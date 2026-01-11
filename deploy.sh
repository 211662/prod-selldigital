#!/bin/bash

# Deploy Script for Digital Ocean
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables - UPDATE THESE
SERVER_USER="root"
SERVER_IP="YOUR_SERVER_IP"
APP_NAME="selldigital"
APP_DIR="/var/www/$APP_NAME"
DOMAIN="yourdomain.com"  # Optional

echo -e "${BLUE}📦 Building application...${NC}"
npm run build

echo -e "${BLUE}📤 Uploading to server...${NC}"
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' \
    ./ $SERVER_USER@$SERVER_IP:$APP_DIR/

echo -e "${BLUE}🔧 Installing dependencies on server...${NC}"
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /var/www/selldigital
npm install --production
npx prisma generate
npx prisma db push

# Restart PM2
pm2 restart selldigital || pm2 start npm --name "selldigital" -- start

echo -e "✅ Deployment completed!"
ENDSSH

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Your app is running on: http://$SERVER_IP:3000${NC}"
