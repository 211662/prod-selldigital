#!/bin/bash

sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no root@139.59.111.150 << 'EOF'
cd /var/www/selldigital

echo "=== Pull latest code from Git ==="
git fetch origin
git reset --hard origin/main
git log -1 --oneline

echo -e "\n=== Regenerate Prisma Client ==="
npx prisma generate

echo -e "\n=== Clean old build ==="
rm -rf .next

echo -e "\n=== Build application ==="
NODE_ENV=production npm run build

echo -e "\n=== Check build output ==="
ls -la .next/server/app/ | head -20

echo -e "\n=== Restart PM2 ==="
pm2 restart selldigital

echo -e "\n=== Wait for app to start ==="
sleep 5

echo -e "\n=== Test homepage ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000

echo -e "\n=== PM2 Status ==="
pm2 status
EOF
