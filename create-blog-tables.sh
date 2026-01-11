#!/bin/bash

# Force create blog tables on production

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🗄️  Force creating blog tables..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

cd /var/www/selldigital

echo "📋 Current database schema:"
npx prisma db execute --stdin <<SQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('Post', 'PostCategory', 'Tag', 'Comment')
ORDER BY table_name;
SQL

echo ""
echo "🔄 Creating blog tables with migration..."
npx prisma migrate dev --name add_blog_system --skip-generate

echo ""
echo "✅ Verifying tables created:"
npx prisma db execute --stdin <<SQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('Post', 'PostCategory', 'Tag', 'PostTag', 'Comment')
ORDER BY table_name;
SQL

echo ""
echo "♻️  Restarting app..."
pm2 restart selldigital

ENDSSH

echo ""
echo "✅ Blog tables created!"
echo "🌐 Test: http://139.59.111.150:3000/blog"
