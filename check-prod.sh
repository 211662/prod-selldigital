#!/bin/bash

# Quick check production server status
# Usage: ./check-prod.sh

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🔍 Checking production server..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

echo "📊 Current directory:"
pwd
echo ""

echo "📂 App location:"
cd /var/www/selldigital && pwd
echo ""

echo "🔄 Git status:"
git log -1 --oneline
echo ""

echo "📦 PM2 status:"
pm2 list
echo ""

echo "🗄️  Database tables (checking for blog tables):"
cd /var/www/selldigital
npx prisma db execute --stdin <<SQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
SQL

echo ""
echo "✅ Check complete!"

ENDSSH

echo ""
echo "🌐 Production URL: http://139.59.111.150:3000"
echo "🔗 Blog: http://139.59.111.150:3000/blog"
echo "👤 Admin: http://139.59.111.150:3000/admin/blog/posts"
