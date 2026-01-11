#!/bin/bash

# Check blog routes on production

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🔍 Checking blog routes on production..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

cd /var/www/selldigital

echo "📂 Checking blog files exist:"
ls -la src/app/ | grep "(public)"
echo ""

echo "📂 Blog directory structure:"
ls -la src/app/\(public\)/blog/
echo ""

echo "🏗️  Checking .next build:"
ls -la .next/server/app/ | grep -E "(blog|public)"
echo ""

echo "📦 Git status:"
git status

ENDSSH

echo ""
echo "✅ Check complete!"
