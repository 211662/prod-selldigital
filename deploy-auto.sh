#!/bin/bash

# Quick Deploy from Git to Digital Ocean
# Server: 139.59.111.150

set -e

SERVER_IP="139.59.111.150"
SERVER_USER="root"
APP_NAME="selldigital"
APP_DIR="/var/www/$APP_NAME"
GIT_REPO="https://github.com/211662/prod-selldigital.git"

echo "🚀 Deploying to $SERVER_IP..."

# Deploy on server
sshpass -p 'hHao040596!h' ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'ENDSSH'

# Install required packages if needed
command -v node >/dev/null 2>&1 || {
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
}

command -v pm2 >/dev/null 2>&1 || {
    echo "📦 Installing PM2..."
    npm install -g pm2
}

command -v nginx >/dev/null 2>&1 || {
    echo "📦 Installing Nginx..."
    apt install -y nginx
}

# Setup PostgreSQL if not exists
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    apt install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    
    # Create database
    sudo -u postgres psql << EOF
CREATE DATABASE selldigital;
CREATE USER selldigital WITH ENCRYPTED PASSWORD 'SellDigital2026!';
GRANT ALL PRIVILEGES ON DATABASE selldigital TO selldigital;
ALTER DATABASE selldigital OWNER TO selldigital;
EOF
fi

# Clone or pull repo
if [ -d "/var/www/selldigital" ]; then
    echo "📥 Pulling latest changes..."
    cd /var/www/selldigital
    git pull
else
    echo "📥 Cloning repository..."
    mkdir -p /var/www
    cd /var/www
    git clone https://github.com/YOUR_USERNAME/prod-selldigital.git selldigital
    cd selldigital
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
DATABASE_URL="postgresql://selldigital:SellDigital2026!@localhost:5432/selldigital?schema=public"
NEXTAUTH_URL="http://139.59.111.150:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production-32-chars-min"
ENCRYPTION_KEY="12345678901234567890123456789012"
NEXT_PUBLIC_APP_URL="http://139.59.111.150:3000"
NEXT_PUBLIC_APP_NAME="SellDigital"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
RESEND_API_KEY=""
EMAIL_FROM="noreply@localhost.com"
EOF
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "🗄️  Setting up database..."
npx prisma db push --accept-data-loss

# Seed database (only first time)
if ! npm run prisma:seed 2>/dev/null; then
    echo "ℹ️  Database already seeded or seed failed"
fi

# Build Next.js app
echo "🏗️  Building application..."
npm run build

# Setup Nginx if not configured
if [ ! -f "/etc/nginx/sites-available/selldigital" ]; then
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
fi

# Setup firewall
ufw --force enable
ufw allow 22
ufw allow 80
ufw allow 443

# Start or restart with PM2
echo "🚀 Starting application..."
pm2 delete selldigital 2>/dev/null || true
pm2 start npm --name "selldigital" -- start
pm2 save
pm2 startup systemd -u root --hp /root

echo ""
echo "✅ Deployment completed!"
echo "🌐 Access your app at: http://139.59.111.150"
echo ""
echo "📊 Useful commands:"
echo "   ssh root@139.59.111.150"
echo "   pm2 logs selldigital"
echo "   pm2 restart selldigital"
echo ""

ENDSSH

echo "✅ Done! Your app is live at http://139.59.111.150"
