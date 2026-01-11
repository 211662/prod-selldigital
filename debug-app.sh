#!/bin/bash

sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no root@139.59.111.150 << 'EOF'
echo "=== Check .next folder ==="
ls -la /var/www/selldigital/.next/ | head -15

echo -e "\n=== Check if prerender-manifest.json exists ==="
cat /var/www/selldigital/.next/prerender-manifest.json

echo -e "\n=== Check package.json start script ==="
cat /var/www/selldigital/package.json | grep -A 2 "scripts"

echo -e "\n=== Test actual response from app ==="
curl -s http://localhost:3000 | head -20

echo -e "\n=== Check PM2 environment ==="
pm2 env 2
EOF
