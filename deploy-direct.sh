#!/bin/bash

# Direct Deploy to Digital Ocean (without Git)
# Uploads files directly from local to server

set -e

SERVER_IP="139.59.111.150"
SERVER_USER="root"
SERVER_PASS="hHao040596!h"
APP_DIR="/var/www/selldigital"

echo "🚀 Direct Deploy to $SERVER_IP..."

# Install sshpass if not exists (for password auth)
if ! command -v sshpass &> /dev/null; then
    echo "📦 Installing sshpass..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass 2>/dev/null || {
            echo "⚠️  Please install sshpass manually or use SSH key"
            echo "Continue with manual SSH? (y/n)"
            read answer
            if [ "$answer" != "y" ]; then
                exit 1
            fi
        }
    fi
fi

# Create temporary directory for deployment
echo "📦 Preparing files..."
rm -rf /tmp/selldigital-deploy
mkdir -p /tmp/selldigital-deploy

# Copy necessary files (exclude node_modules, .git, etc)
rsync -av \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude '.env' \
    ./ /tmp/selldigital-deploy/

echo "📤 Uploading to server..."

# Use sshpass if available, otherwise use regular ssh
if command -v sshpass &> /dev/null; then
    # Upload files
    sshpass -p "$SERVER_PASS" rsync -avz \
        -e "ssh -o StrictHostKeyChecking=no" \
        /tmp/selldigital-deploy/ \
        $SERVER_USER@$SERVER_IP:$APP_DIR/
    
    # Setup and start on server
    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP bash << 'ENDSSH'
#!/bin/bash
set -e

cd /var/www/selldigital

echo "📦 Installing system packages..."

# Install Node.js if not exists
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PostgreSQL if not exists
if ! command -v psql &> /dev/null; then
    apt update
    apt install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE DATABASE selldigital;
CREATE USER selldigital WITH ENCRYPTED PASSWORD 'SellDigital2026!';
GRANT ALL PRIVILEGES ON DATABASE selldigital TO selldigital;
ALTER DATABASE selldigital OWNER TO selldigital;
\q
EOF
fi

# Install Nginx if not exists
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
fi

# Install PM2 if not exists
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://selldigital:SellDigital2026!@localhost:5432/selldigital?schema=public"
NEXTAUTH_URL="http://139.59.111.150:3000"
NEXTAUTH_SECRET="super-secret-nextauth-key-min-32-characters-long-change-in-production"
ENCRYPTION_KEY="12345678901234567890123456789012"
NEXT_PUBLIC_APP_URL="http://139.59.111.150:3000"
NEXT_PUBLIC_APP_NAME="SellDigital"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
RESEND_API_KEY=""
EMAIL_FROM="noreply@selldigital.com"
EOF
fi

echo "📦 Installing Node dependencies..."
npm install

echo "🔧 Setting up Prisma..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npm run prisma:seed 2>/dev/null || echo "Database already seeded"

echo "🏗️  Building Next.js app..."
npm run build

# Configure Nginx
echo "🔧 Configuring Nginx..."
cat > /etc/nginx/sites-available/selldigital << 'NGINXEOF'
server {
    listen 80;
    server_name 139.59.111.150;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/selldigital /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Configure firewall
ufw --force enable
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000

echo "🚀 Starting application with PM2..."
pm2 delete selldigital 2>/dev/null || true
pm2 start npm --name "selldigital" -- start
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application is now live at:"
echo "   http://139.59.111.150"
echo ""
echo "📊 Management commands:"
echo "   pm2 status"
echo "   pm2 logs selldigital"
echo "   pm2 restart selldigital"
echo ""
echo "🔑 Default login:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""

ENDSSH

else
    echo "⚠️  sshpass not available. Using manual SSH..."
    echo "Please run these commands on the server manually:"
    echo ""
    echo "1. SSH to server: ssh root@139.59.111.150"
    echo "2. Create directory: mkdir -p /var/www/selldigital"
    echo "3. Exit and run: rsync -avz ./ root@139.59.111.150:/var/www/selldigital/"
    exit 1
fi

# Cleanup
rm -rf /tmp/selldigital-deploy

echo ""
echo "✅✅✅ DEPLOYMENT COMPLETE! ✅✅✅"
echo ""
echo "🌐 Access your app: http://139.59.111.150"
echo "🔐 Login: admin@example.com / admin123"
echo ""
