#!/bin/bash

# Update production with blog system
# This will run migrations and restart the app

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🚀 Updating production with blog system..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

cd /var/www/selldigital

echo "📦 Installing new packages (TipTap, Dialog, etc)..."
npm install

echo ""
echo "🔄 Running Prisma migration for blog tables..."
npx prisma generate
npx prisma db push --accept-data-loss

echo ""
echo "🏗️  Building application..."
npm run build

echo ""
echo "♻️  Restarting PM2..."
pm2 restart selldigital

echo ""
echo "✅ Update complete!"
echo ""
echo "📊 PM2 Status:"
pm2 list

echo ""
echo "🔍 Checking blog tables..."
npx prisma db execute --stdin <<SQL
SELECT COUNT(*) as post_count FROM "Post";
SELECT COUNT(*) as category_count FROM "PostCategory";
SELECT COUNT(*) as tag_count FROM "Tag";
SQL

ENDSSH

echo ""
echo "✅ Production updated successfully!"
echo ""
echo "🌐 Test URLs:"
echo "   Homepage: http://139.59.111.150:3000"
echo "   Blog: http://139.59.111.150:3000/blog"
echo "   Admin Blog: http://139.59.111.150:3000/admin/blog/posts"
echo "   Categories: http://139.59.111.150:3000/admin/blog/categories"
echo "   Tags: http://139.59.111.150:3000/admin/blog/tags"
echo ""
echo "📝 Next steps:"
echo "   1. Login as admin"
echo "   2. Create categories and tags"
echo "   3. Create sample blog posts"
echo "   4. Test all features"
