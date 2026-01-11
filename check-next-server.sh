#!/bin/bash

sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no root@139.59.111.150 << 'EOF'
echo "=== Check .next/server structure ==="
ls -la /var/www/selldigital/.next/server/

echo -e "\n=== Check app folder ==="
ls -la /var/www/selldigital/.next/server/app 2>/dev/null || echo "No app folder found!"

echo -e "\n=== Check pages folder ==="
ls -la /var/www/selldigital/.next/server/pages 2>/dev/null || echo "No pages folder found!"

echo -e "\n=== Check src structure ==="
ls -la /var/www/selldigital/src/app/ | head -10
EOF
