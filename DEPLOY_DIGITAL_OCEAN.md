# 🚀 HƯỚNG DẪN DEPLOY LÊN DIGITAL OCEAN

## Yêu cầu

- Digital Ocean Droplet (Ubuntu 22.04)
- IP Server
- SSH access

---

## BƯỚC 1: Setup Server (Chỉ làm 1 lần)

### 1.1. SSH vào server

```bash
ssh root@YOUR_SERVER_IP
```

### 1.2. Upload script setup

Từ máy local:
```bash
scp server-setup.sh root@YOUR_SERVER_IP:/root/
```

### 1.3. Chạy script trên server

```bash
ssh root@YOUR_SERVER_IP
chmod +x server-setup.sh
./server-setup.sh
```

Script sẽ tự động cài:
- ✅ Node.js 20
- ✅ PostgreSQL
- ✅ Nginx
- ✅ PM2
- ✅ Firewall
- ✅ Tạo database
- ✅ Tạo .env file

### 1.4. Cập nhật .env trên server

```bash
nano /var/www/selldigital/.env
```

Sửa:
- `YOUR_SERVER_IP` → IP thật của bạn
- `your_secure_password_here` → Password mạnh
- Các giá trị khác nếu cần

---

## BƯỚC 2: Deploy App (Mỗi lần update)

### 2.1. Cập nhật deploy.sh

Sửa file `deploy.sh` trên local:
```bash
nano deploy.sh
```

Thay đổi:
```bash
SERVER_IP="YOUR_SERVER_IP"     # Thay bằng IP thật
SERVER_USER="root"             # Hoặc user khác
```

### 2.2. Cho phép execute

```bash
chmod +x deploy.sh
```

### 2.3. Deploy!

```bash
./deploy.sh
```

Script sẽ:
1. Build app local
2. Upload lên server
3. Install dependencies
4. Setup database
5. Start app với PM2

---

## BƯỚC 3: Truy cập

```
http://YOUR_SERVER_IP

Hoặc nếu có domain:
http://yourdomain.com
```

---

## 🔧 Quản lý App

### Xem logs
```bash
ssh root@YOUR_SERVER_IP
pm2 logs selldigital
```

### Restart app
```bash
ssh root@YOUR_SERVER_IP
pm2 restart selldigital
```

### Stop app
```bash
ssh root@YOUR_SERVER_IP
pm2 stop selldigital
```

### Xem status
```bash
ssh root@YOUR_SERVER_IP
pm2 status
```

---

## 🌐 Setup Domain (Optional)

### 1. Point domain tới server IP

Vào DNS provider, tạo A record:
```
@ → YOUR_SERVER_IP
www → YOUR_SERVER_IP
```

### 2. Update Nginx config

```bash
ssh root@YOUR_SERVER_IP
nano /etc/nginx/sites-available/selldigital
```

Sửa:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

Restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

### 3. Install SSL (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔍 Troubleshooting

### App không chạy?

```bash
# Xem logs
pm2 logs selldigital

# Restart
pm2 restart selldigital

# Hoặc start lại
cd /var/www/selldigital
pm2 delete selldigital
pm2 start npm --name "selldigital" -- start
```

### Database error?

```bash
# Check PostgreSQL
systemctl status postgresql

# Test connection
sudo -u postgres psql
\l  # List databases
\q  # Quit
```

### Port 3000 bị chiếm?

```bash
# Tìm process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Restart app
pm2 restart selldigital
```

---

## 📊 Database Management

### Seed database

```bash
ssh root@YOUR_SERVER_IP
cd /var/www/selldigital
npm run prisma:seed
```

### Prisma Studio (Database GUI)

```bash
ssh root@YOUR_SERVER_IP -L 5555:localhost:5555
cd /var/www/selldigital
npx prisma studio
```

Mở browser: http://localhost:5555

### Backup database

```bash
ssh root@YOUR_SERVER_IP
pg_dump -U selldigital selldigital > backup_$(date +%Y%m%d).sql
```

### Restore database

```bash
ssh root@YOUR_SERVER_IP
psql -U selldigital selldigital < backup_20260111.sql
```

---

## ⚡ Quick Commands

```bash
# Deploy mới nhất
./deploy.sh

# SSH vào server
ssh root@YOUR_SERVER_IP

# Xem logs realtime
ssh root@YOUR_SERVER_IP "pm2 logs selldigital --lines 100"

# Restart app
ssh root@YOUR_SERVER_IP "pm2 restart selldigital"

# Check status
ssh root@YOUR_SERVER_IP "pm2 status"
```

---

## 💰 Chi phí Digital Ocean

**Droplet đề xuất:**
- Basic: $6/month (1GB RAM, 1 CPU)
- Better: $12/month (2GB RAM, 1 CPU) ✅ Recommend
- Production: $24/month (4GB RAM, 2 CPU)

---

## 🎯 Checklist

### Lần đầu setup:
- [ ] Tạo Droplet trên Digital Ocean
- [ ] SSH vào server
- [ ] Upload và chạy `server-setup.sh`
- [ ] Cập nhật `.env` trên server
- [ ] Test PostgreSQL
- [ ] Test Nginx

### Mỗi lần deploy:
- [ ] Update code trên local
- [ ] Commit changes
- [ ] Chạy `./deploy.sh`
- [ ] Check logs: `pm2 logs`
- [ ] Test website

### Production ready:
- [ ] Setup domain
- [ ] Install SSL certificate
- [ ] Setup backup tự động
- [ ] Monitor logs
- [ ] Setup alerts

---

**Ready to deploy! 🚀**
