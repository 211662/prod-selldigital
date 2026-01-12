#!/bin/bash

sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no root@139.59.111.150 << 'EOF'
cd /var/www/selldigital

echo "=== Stop all PM2 processes ==="
pm2 stop all
pm2 delete all

echo -e "\n=== Pull latest code ==="
git fetch origin
git reset --hard origin/main

echo -e "\n=== Clean everything ==="
rm -rf node_modules
rm -rf .next
rm -f package-lock.json

echo -e "\n=== Install dependencies ==="
npm install

echo -e "\n=== Generate Prisma Client ==="
npx prisma generate

echo -e "\n=== Build app ==="
NODE_ENV=production npm run build

echo -e "\n=== Check build output ==="
ls -la .next/server/app/ | head -15
echo ""
find .next/server/app -type f -name "*.js" | head -20

echo -e "\n=== Start PM2 with PORT=3000 ==="
PORT=3000 pm2 start npm --name selldigital -- start
pm2 save

echo -e "\n=== Wait for app to start ==="
sleep 5

echo -e "\n=== Check PM2 status ==="
pm2 status

echo -e "\n=== Check logs ==="
pm2 logs selldigital --lines 10 --nostream

echo -e "\n=== Test app ==="
curl -I http://localhost:3000
EOF
