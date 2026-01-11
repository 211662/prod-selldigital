#!/bin/bash

# Server Setup Script for Digital Ocean Ubuntu 22.04
# Run this on your Digital Ocean server

set -e

echo "🔧 Setting up server for SellDigital..."

# Update system
echo "📦 Updating system..."
apt update && apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
apt install -y postgresql postgresql-contrib

# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
echo "📦 Creating database..."
sudo -u postgres psql << EOF
CREATE DATABASE selldigital;
CREATE USER selldigital WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE selldigital TO selldigital;
ALTER DATABASE selldigital OWNER TO selldigital;
\q
EOF

# Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Create app directory
echo "📦 Creating app directory..."
mkdir -p /var/www/selldigital
chown -R $USER:$USER /var/www/selldigital

# Create .env file
echo "📦 Creating .env file..."
cat > /var/www/selldigital/.env << 'EOF'
# Database
DATABASE_URL="postgresql://selldigital:your_secure_password_here@localhost:5432/selldigital?schema=public"

# NextAuth
NEXTAUTH_URL="http://YOUR_SERVER_IP:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# Encryption (must be exactly 32 characters)
ENCRYPTION_KEY="$(openssl rand -base64 24)"

# App
NEXT_PUBLIC_APP_URL="http://YOUR_SERVER_IP:3000"
NEXT_PUBLIC_APP_NAME="SellDigital"

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
EOF

# Setup Nginx
echo "📦 Configuring Nginx..."
cat > /etc/nginx/sites-available/selldigital << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

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
EOF

# Enable site
ln -sf /etc/nginx/sites-available/selldigital /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

# Setup firewall
echo "🔒 Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Server setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env file with your actual values"
echo "2. Deploy your app: ./deploy.sh"
echo "3. App will run on: http://YOUR_SERVER_IP"
echo ""
echo "⚙️  Useful commands:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs selldigital - View logs"
echo "  pm2 restart selldigital - Restart app"
