#!/bin/bash

# Generate Prisma and rebuild

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🔄 Generating Prisma Client and rebuilding..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

cd /var/www/selldigital

echo "🔄 Generating Prisma Client with blog models..."
npx prisma generate

echo ""
echo "🏗️  Building application..."
npm run build

echo ""
echo "♻️  Restarting..."
pm2 restart selldigital

echo ""
echo "✅ Checking build output:"
ls -la .next/server/app/ | grep -E "blog|public"

ENDSSH

echo ""
echo "✅ Done!"
echo "🔗 Test: http://139.59.111.150:3000/blog"
