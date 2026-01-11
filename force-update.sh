#!/bin/bash

# Force pull and rebuild with blog system

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🔄 Force updating production..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

cd /var/www/selldigital

echo "📥 Pulling latest code..."
git fetch origin
git reset --hard origin/main
git pull origin main

echo ""
echo "📂 Checking blog files:"
ls -la src/app/\(public\)/ 2>/dev/null || echo "❌ (public) folder not found!"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building..."
npm run build

echo ""
echo "♻️  Restarting..."
pm2 restart selldigital

echo ""
echo "✅ Done! Checking routes:"
ls -la .next/server/app/ | grep -i blog

ENDSSH

echo ""
echo "✅ Production updated!"
echo "🔗 Test: http://139.59.111.150:3000/blog"
