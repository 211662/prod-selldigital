# 🚀 Hướng dẫn Deploy lên Production

## ✅ Build đã thành công!

Dự án đã build thành công với chỉ một số warnings nhỏ không ảnh hưởng.

## 📋 Các bước Deploy

### 1. Push code lên repository
```bash
git add .
git commit -m "feat: Complete blog system with admin & public pages"
git push origin main
```

### 2. Deploy lên server (Vercel/Railway/VPS)

#### Option A: Vercel (Khuyến nghị - Miễn phí)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Hoặc deploy production ngay
vercel --prod
```

#### Option B: Railway
1. Truy cập https://railway.app
2. Connect GitHub repository
3. Chọn project của bạn
4. Railway sẽ tự động deploy

#### Option C: VPS (Ubuntu)
```bash
# Trên server
git clone <your-repo-url>
cd prod-selldigital
npm install
npm run build
pm2 start npm --name "selldigital" -- start
```

### 3. Setup Database trên Production

**Quan trọng:** Cần chạy migrations để tạo bảng blog mới

```bash
# Trên server production (hoặc local nếu dùng production DB)
npx prisma migrate dev --name add_blog_system

# Hoặc nếu DB đã có:
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Environment Variables cần thiết

Đảm bảo các biến môi trường sau được set trên production:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="<generate-random-secret>"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Email (Optional - nếu muốn gửi email)
RESEND_API_KEY="re_..."
EMAIL_FROM="SellDigital <noreply@yourdomain.com>"

# Payment (Optional)
MOMO_PARTNER_CODE="..."
MOMO_ACCESS_KEY="..."
MOMO_SECRET_KEY="..."
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Tạo dữ liệu mẫu cho Blog

Sau khi deploy, login với account ADMIN và:

1. **Tạo Categories** tại `/admin/blog/categories`:
   - Hướng dẫn (huong-dan)
   - Tin tức (tin-tuc)
   - Tips & Tricks (tips-tricks)
   - Review (review)
   - Khuyến mãi (khuyen-mai)

2. **Tạo Tags** tại `/admin/blog/tags`:
   - Netflix
   - Spotify
   - YouTube Premium
   - Disney+
   - HBO Max
   - Apple Music

3. **Tạo bài viết mẫu** tại `/admin/blog/posts/new`:
   - Upload featured image
   - Viết content với TipTap editor
   - Chọn category & tags
   - Điền SEO fields
   - Publish

## 🧪 Kiểm tra sau khi deploy

### Public Pages
- [ ] Homepage: `https://your-domain.com`
  - Hiển thị 4 blog posts mới nhất
- [ ] Blog Homepage: `https://your-domain.com/blog`
  - Featured post hero
  - Grid posts với pagination
  - Sidebar categories & popular posts
- [ ] Single Post: `https://your-domain.com/blog/[slug]`
  - Full content hiển thị
  - View count tự động tăng
  - Comments section
  - Related posts (3 bài)

### Admin Pages (Login required with ADMIN role)
- [ ] Posts Management: `/admin/blog/posts`
  - List, search, filter posts
  - Edit, delete posts
  - View counts
- [ ] Create Post: `/admin/blog/posts/new`
  - TipTap editor hoạt động
  - Upload featured image
  - Select categories & tags
  - SEO fields
- [ ] Edit Post: `/admin/blog/posts/[id]/edit`
  - Pre-filled data
  - Update post
- [ ] Categories: `/admin/blog/categories`
  - CRUD categories với Dialog
- [ ] Tags: `/admin/blog/tags`
  - CRUD tags với Dialog
- [ ] Comments: `/admin/blog/comments`
  - Approve/reject comments
  - Delete comments

### SEO
- [ ] Sitemap: `https://your-domain.com/sitemap.xml`
- [ ] Robots: `https://your-domain.com/robots.txt`

## 📊 Database Schema Created

```sql
-- Posts table (blog posts)
Post {
  id, title, slug, excerpt, content
  featuredImage, categoryId, authorId
  metaTitle, metaDescription, metaKeywords
  status, published, publishedAt
  viewCount, createdAt, updatedAt
}

-- Categories
PostCategory {
  id, name, slug, description, order
}

-- Tags
Tag {
  id, name, slug
}

-- Post-Tag relation
PostTag {
  postId, tagId
}

-- Comments
Comment {
  id, content, postId, userId, parentId
  status (PENDING/APPROVED/REJECTED)
  createdAt, updatedAt
}
```

## 🔧 Troubleshooting

### "Prisma Client has not been generated"
```bash
npx prisma generate
```

### "Can't reach database server"
- Kiểm tra DATABASE_URL
- Whitelist IP của server trên database provider
- Test connection: `npx prisma db push --force-reset`

### "Build fails on Vercel"
- Check environment variables
- Ensure all dependencies in package.json
- Check build logs for specific errors

### "Blog posts not showing"
- Kiểm tra posts có status="PUBLISHED" và published=true
- Chạy: `npx prisma studio` để xem database

## 📈 Performance Tips

1. **Image Optimization**
   - Dùng Cloudinary hoặc ImageKit cho featured images
   - Update featuredImage với CDN URLs

2. **Caching**
   - Blog posts có thể cache với `revalidate: 3600` (1 hour)
   - Sitemap cache với `revalidate: 3600`

3. **Database Indexes**
   - Schema đã có indexes cho:
     - Post.slug (unique)
     - Post.published + status
     - Comment.status + postId

## 🎯 Next Steps (Optional Improvements)

1. **Upload Images**
   - Tích hợp Cloudinary/Uploadcare cho upload ảnh
   - Update featured image field với upload button

2. **Comments UI**
   - Thêm comment form ở public blog pages
   - Real-time updates với SSE/WebSocket

3. **Analytics**
   - Google Analytics integration
   - Track popular posts

4. **Newsletter**
   - Subscribe form ở blog homepage
   - Email newsletter với Resend

5. **Social Sharing**
   - Share buttons cho posts
   - Open Graph meta tags

## 📞 Support

Nếu có vấn đề khi deploy, check:
1. Build logs
2. Server logs (pm2 logs hoặc Vercel logs)
3. Database connection
4. Environment variables

---

**Status:** ✅ Ready for Production
**Last Updated:** 12/01/2026
