#!/bin/bash

# Fix Nginx to point to correct port

SERVER_IP="139.59.111.150"
SERVER_USER="root"
SERVER_PASS="hHao040596!h"

echo "🔧 Fixing Nginx configuration..."
echo ""

sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

echo "📝 Updating Nginx config to port 3000..."

cat > /etc/nginx/sites-available/default << 'NGINXCONF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 139.59.111.150 _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXCONF

echo ""
echo "✅ Testing Nginx config..."
nginx -t

echo ""
echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo ""
echo "🔍 Testing endpoint..."
sleep 2
curl -I http://localhost 2>&1 | head -10

ENDSSH

echo ""
echo "✅ Nginx fixed!"
echo "🌐 Test: http://139.59.111.150"
