#!/bin/bash

sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no root@139.59.111.150 << 'EOF'
cd /var/www/selldigital

echo "=== Git pull latest code ==="
git fetch origin
git reset --hard origin/main

echo -e "\n=== Clean install dependencies ==="
rm -rf node_modules package-lock.json
npm install

echo -e "\n=== Generate Prisma Client ==="
npx prisma generate

echo -e "\n=== Remove old build ==="
rm -rf .next

echo -e "\n=== Build app ==="
npm run build

echo -e "\n=== Restart PM2 ==="
pm2 restart selldigital

echo -e "\n=== Wait and check status ==="
sleep 5
pm2 status
EOF
