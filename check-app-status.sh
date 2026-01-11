#!/bin/bash

# Check app status after rebuild
sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no root@139.59.111.150 << 'EOF'
echo "=== PM2 Status ==="
pm2 status

echo -e "\n=== Latest Logs ==="
pm2 logs selldigital --lines 15 --nostream

echo -e "\n=== Test Homepage ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000

echo -e "\n=== Test Blog Page ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000/blog
EOF
