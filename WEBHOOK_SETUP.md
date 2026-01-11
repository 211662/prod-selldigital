# 🎣 Hướng dẫn cài đặt GitHub Webhook

## ✅ Đã setup trên server

Webhook server đã được cài đặt và đang chạy trên:
- **URL:** http://139.59.111.150:9000/webhook
- **Port:** 9000
- **Status:** Online (PM2)

## 📝 Cấu hình Webhook trên GitHub

### Bước 1: Truy cập Settings

Truy cập: https://github.com/211662/prod-selldigital/settings/hooks

### Bước 2: Add webhook

Click nút **"Add webhook"** ở góc trên bên phải

### Bước 3: Điền thông tin

```
Payload URL:
http://139.59.111.150:9000/webhook

Content type:
application/json

Secret:
selldigital-webhook-secret-2026

Which events would you like to trigger this webhook?
☑️ Just the push event

Active:
☑️ (checked)
```

### Bước 4: Add webhook

Click nút **"Add webhook"** ở cuối trang

## 🧪 Test Webhook

### Cách 1: Push code thử nghiệm

```bash
# Trên máy local
cd /Users/linh/Desktop/github/prod-selldigital

# Thêm file test
echo "# Test webhook" >> test.txt
git add test.txt
git commit -m "Test webhook auto-deploy"
git push origin main
```

### Cách 2: Test manual trên GitHub

1. Vào webhook vừa tạo
2. Scroll xuống phần "Recent Deliveries"
3. Click "Redeliver" để test lại

## 📊 Kiểm tra Logs

### Xem webhook logs (real-time):
```bash
ssh root@139.59.111.150
pm2 logs webhook
```

### Xem deploy logs:
```bash
ssh root@139.59.111.150
tail -f /var/log/webhook-deploy.log
```

### Check PM2 status:
```bash
ssh root@139.59.111.150
pm2 list
```

## 🔄 Quy trình Auto-Deploy

Khi bạn push code lên GitHub:

1. **GitHub** → Gửi webhook đến server
2. **Webhook Server** → Nhận request, verify signature
3. **Auto-Deploy Script** → 
   - Backup code hiện tại
   - Pull code mới từ GitHub
   - Install dependencies (nếu có thay đổi)
   - Update database (nếu có thay đổi)
   - Build Next.js
   - Restart PM2
   - Verify deployment
4. **Rollback tự động** nếu deploy failed

## 📁 Files đã tạo

```
/var/www/selldigital/
├── auto-deploy.sh          # Script tự động deploy
├── webhook-server.js       # Webhook server
└── /var/log/
    └── webhook-deploy.log  # Deploy logs
```

## 🛠️ Quản lý Webhook

### Restart webhook server:
```bash
ssh root@139.59.111.150
pm2 restart webhook
```

### Stop webhook:
```bash
ssh root@139.59.111.150
pm2 stop webhook
```

### Xem logs chi tiết:
```bash
ssh root@139.59.111.150
pm2 logs webhook --lines 100
```

### Test manual deploy:
```bash
ssh root@139.59.111.150
cd /var/www/selldigital
./auto-deploy.sh
```

## 🔐 Security

- ✅ Webhook signature verification (SHA256)
- ✅ Secret key validation
- ✅ Only accept push to main/master branch
- ✅ Auto rollback on failure
- ✅ Firewall configured (UFW)

## ⚠️ Lưu ý

1. **Branch:** Chỉ auto-deploy khi push lên `main` hoặc `master`
2. **Backup:** Mỗi lần deploy tự động backup code cũ
3. **Logs:** Tất cả deploy logs được lưu tại `/var/log/webhook-deploy.log`
4. **Rollback:** Tự động restore từ backup nếu deploy failed
5. **Port:** Webhook server chạy trên port 9000

## 🎯 Kết quả mong đợi

Sau khi setup xong:

1. Mỗi lần `git push origin main`
2. Sau ~30 giây
3. Website tự động cập nhật code mới
4. Không cần SSH vào server

## 📞 Troubleshooting

### Webhook không hoạt động?

1. Check PM2 status:
```bash
pm2 list
```

2. Check logs:
```bash
pm2 logs webhook
```

3. Test webhook server:
```bash
curl http://139.59.111.150:9000/health
```

4. Check firewall:
```bash
ufw status
```

### Deploy failed?

Code tự động rollback về bản backup. Check logs:
```bash
tail -50 /var/log/webhook-deploy.log
```

## 📚 Resources

- GitHub Webhooks: https://docs.github.com/en/webhooks
- PM2 Documentation: https://pm2.keymetrics.io/
- Repository: https://github.com/211662/prod-selldigital

---

**Setup date:** 11/01/2026  
**Server IP:** 139.59.111.150  
**Webhook Port:** 9000  
**Website:** http://139.59.111.150
