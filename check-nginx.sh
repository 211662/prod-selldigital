#!/bin/bash

# Check Nginx and app status

SERVER_IP="139.59.111.150"
SERVER_USER="root"
SERVER_PASS="hHao040596!h"

echo "🔍 Checking Nginx and app status..."
echo ""

sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

echo "📊 PM2 Status:"
pm2 list

echo ""
echo "🌐 Nginx Status:"
systemctl status nginx --no-pager | head -20

echo ""
echo "📄 Nginx Config:"
cat /etc/nginx/sites-available/selldigital 2>/dev/null || cat /etc/nginx/sites-available/default | grep -A 20 "server {"

echo ""
echo "🔗 Testing local endpoint:"
curl -I http://localhost:3000 2>&1 | head -5

ENDSSH

echo ""
echo "✅ Check complete!"
echo ""
echo "🌐 Production URLs (without port):"
echo "   Homepage: http://139.59.111.150"
echo "   Blog: http://139.59.111.150/blog"
echo "   Admin: http://139.59.111.150/admin"
