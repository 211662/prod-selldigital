# PHASE PHỤ: BLOG SYSTEM - SEO & NEWS
**Mục đích**: Tăng traffic thông qua SEO, cung cấp tin tức, hướng dẫn sử dụng sản phẩm

---

## 🎯 MỤC TIÊU

### SEO Benefits
- ✅ Tăng organic traffic từ Google
- ✅ Cải thiện domain authority
- ✅ Target long-tail keywords
- ✅ Backlink opportunities
- ✅ Social sharing để viral

### User Benefits
- ✅ Hướng dẫn sử dụng tài khoản Netflix, Spotify, etc.
- ✅ Review sản phẩm, so sánh gói premium
- ✅ Tips & tricks về streaming services
- ✅ Tin tức về khuyến mãi, sản phẩm mới
- ✅ Tăng trust và credibility

---

## 📋 CHỨC NĂNG CHI TIẾT

### 1. DATABASE SCHEMA

#### Post Model (Prisma)
```prisma
model Post {
  id            String        @id @default(cuid())
  title         String
  slug          String        @unique
  excerpt       String?       @db.Text
  content       String        @db.Text
  featuredImage String?
  status        PostStatus    @default(DRAFT)
  published     Boolean       @default(false)
  publishedAt   DateTime?
  viewCount     Int           @default(0)
  
  // SEO
  metaTitle     String?
  metaDescription String?     @db.Text
  metaKeywords  String?
  
  // Relations
  authorId      String
  author        User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  categoryId    String
  category      PostCategory  @relation(fields: [categoryId], references: [id])
  tags          PostTag[]
  comments      Comment[]
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  @@index([slug])
  @@index([authorId])
  @@index([categoryId])
  @@index([published])
  @@index([publishedAt])
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model PostCategory {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  image       String?
  order       Int      @default(0)
  posts       Post[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
}

model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  posts     PostTag[]
  
  @@index([slug])
}

model PostTag {
  postId    String
  tagId     String
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag       Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([postId, tagId])
  @@index([postId])
  @@index([tagId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  status    CommentStatus @default(PENDING)
  
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  parentId  String?
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([postId])
  @@index([userId])
  @@index([status])
}

enum CommentStatus {
  PENDING
  APPROVED
  SPAM
  TRASH
}
```

---

### 2. PUBLIC BLOG PAGES

#### A. Blog Homepage (`/blog`)
**Features:**
- Hero section với featured post (bài mới nhất/nổi bật)
- Grid layout hiển thị danh sách bài viết
- Pagination (10-15 bài/trang)
- Sidebar:
  - Categories list
  - Popular posts (top 5 theo view count)
  - Recent posts (5 bài mới nhất)
  - Tag cloud
  - Search box

**UI Components:**
```typescript
<BlogHero featuredPost={post} />
<BlogGrid posts={posts} />
<BlogSidebar 
  categories={categories}
  popularPosts={popularPosts}
  recentPosts={recentPosts}
  tags={tags}
/>
<Pagination currentPage={page} totalPages={totalPages} />
```

#### B. Single Post Page (`/blog/[slug]`)
**Features:**
- Full post content với rich text editor (Markdown/HTML)
- Featured image
- Author info box
- Publish date, category, tags
- View count
- Share buttons (Facebook, Twitter, LinkedIn, Copy link)
- Table of Contents (TOC) tự động từ headings
- Related posts (3-4 bài cùng category)
- Comments section
- SEO meta tags
- Breadcrumbs navigation

**UI Structure:**
```typescript
<Breadcrumbs />
<article>
  <PostHeader 
    title={post.title}
    author={post.author}
    publishedAt={post.publishedAt}
    category={post.category}
    viewCount={post.viewCount}
  />
  <FeaturedImage src={post.featuredImage} />
  <TableOfContents headings={headings} />
  <PostContent content={post.content} />
  <PostFooter tags={post.tags} />
  <ShareButtons url={postUrl} title={post.title} />
</article>
<RelatedPosts posts={relatedPosts} />
<CommentsSection postId={post.id} comments={comments} />
```

#### C. Category Page (`/blog/category/[slug]`)
**Features:**
- Hiển thị tất cả bài viết trong category
- Category description/header
- Pagination
- Sidebar tương tự blog homepage

#### D. Tag Page (`/blog/tag/[slug]`)
**Features:**
- Hiển thị tất cả bài viết có tag này
- Tag description
- Pagination

#### E. Search Results (`/blog/search?q=...`)
**Features:**
- Full-text search trong title, content, excerpt
- Highlight search keywords
- Filter by category
- Sort by relevance/date

---

### 3. ADMIN BLOG MANAGEMENT

#### A. Posts Management (`/admin/blog/posts`)
**Features:**
- Danh sách tất cả bài viết với filters:
  - Status (All, Published, Draft, Archived)
  - Category
  - Author
  - Search by title
- Bulk actions: Delete, Publish, Archive
- Quick actions: Edit, View, Delete per post
- Table columns:
  - Title (với thumbnail)
  - Author
  - Category
  - Tags
  - Status
  - Views
  - Comments count
  - Published date
  - Actions

#### B. Create/Edit Post (`/admin/blog/posts/new`, `/admin/blog/posts/[id]/edit`)
**Features:**
- **Rich Text Editor**: Sử dụng TipTap hoặc React Quill
  - Bold, Italic, Underline
  - Headings (H1-H6)
  - Lists (ordered, unordered)
  - Links
  - Images upload
  - Code blocks
  - Blockquotes
  - Tables
  - YouTube embed
- **Post Fields:**
  - Title (required)
  - Slug (auto-generate từ title, editable)
  - Excerpt (optional, 160 chars)
  - Content (required)
  - Featured Image upload
  - Category (dropdown)
  - Tags (multi-select with autocomplete)
  - Status (Draft/Published)
  - Publish date (schedule publishing)
- **SEO Section:**
  - Meta Title (60 chars)
  - Meta Description (160 chars)
  - Meta Keywords
  - SEO preview
- **Actions:**
  - Save as Draft
  - Publish
  - Schedule
  - Preview (open in new tab)

#### C. Categories Management (`/admin/blog/categories`)
**Features:**
- CRUD categories
- Reorder categories (drag & drop)
- Table columns:
  - Name
  - Slug
  - Posts count
  - Order
  - Actions (Edit, Delete)

#### D. Tags Management (`/admin/blog/tags`)
**Features:**
- List all tags
- Create/edit/delete tags
- Merge tags
- Posts count per tag

#### E. Comments Moderation (`/admin/blog/comments`)
**Features:**
- List all comments với filters:
  - Status (Pending, Approved, Spam, Trash)
  - Post
  - User
- Bulk actions: Approve, Spam, Trash, Delete
- Quick reply
- Edit comment content
- View user info

---

### 4. API ROUTES

#### Public APIs
```typescript
GET  /api/blog/posts              // List posts (with pagination, filters)
GET  /api/blog/posts/[slug]       // Get single post
POST /api/blog/posts/[id]/view    // Increment view count
GET  /api/blog/categories         // List categories
GET  /api/blog/tags               // List tags
GET  /api/blog/search             // Search posts

// Comments
GET  /api/blog/posts/[id]/comments       // Get post comments
POST /api/blog/posts/[id]/comments       // Create comment (auth required)
PUT  /api/blog/comments/[id]             // Edit own comment
DELETE /api/blog/comments/[id]           // Delete own comment
```

#### Admin APIs
```typescript
// Posts
GET    /api/admin/blog/posts         // List all posts (admin)
POST   /api/admin/blog/posts         // Create post
PUT    /api/admin/blog/posts/[id]    // Update post
DELETE /api/admin/blog/posts/[id]    // Delete post

// Categories
GET    /api/admin/blog/categories
POST   /api/admin/blog/categories
PUT    /api/admin/blog/categories/[id]
DELETE /api/admin/blog/categories/[id]

// Tags
GET    /api/admin/blog/tags
POST   /api/admin/blog/tags
PUT    /api/admin/blog/tags/[id]
DELETE /api/admin/blog/tags/[id]

// Comments
GET    /api/admin/blog/comments
PUT    /api/admin/blog/comments/[id]/approve
PUT    /api/admin/blog/comments/[id]/spam
DELETE /api/admin/blog/comments/[id]
```

---

### 5. SEO OPTIMIZATION

#### Technical SEO
- ✅ Dynamic sitemap.xml generation (`/sitemap.xml`)
- ✅ Robots.txt configuration
- ✅ Structured data (JSON-LD):
  - Article schema
  - Breadcrumb schema
  - Author schema
  - Organization schema
- ✅ Open Graph tags cho social sharing
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Image optimization (Next.js Image)
- ✅ Lazy loading images

#### On-Page SEO
- ✅ H1-H6 hierarchy
- ✅ Alt text cho tất cả images
- ✅ Internal linking
- ✅ URL structure: `/blog/category/post-slug`
- ✅ Meta description unique cho mỗi post
- ✅ Focus keyword optimization

#### Performance
- ✅ Static generation cho blog pages
- ✅ ISR (Incremental Static Regeneration) - revalidate every 60s
- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy load comments

---

### 6. CONTENT STRATEGY

#### Categories (Suggested)
1. **Hướng dẫn sử dụng** - Tutorials
   - "Cách đăng nhập Netflix trên Smart TV"
   - "Hướng dẫn tải nhạc offline trên Spotify"
   
2. **Review sản phẩm** - Reviews
   - "So sánh Netflix Basic vs Premium"
   - "Review Spotify Premium có đáng không?"
   
3. **Tin tức** - News
   - "Netflix ra mắt phim mới tháng 1/2026"
   - "Spotify giảm giá gói Family"
   
4. **Tips & Tricks**
   - "10 mẹo xem Netflix tiết kiệm data"
   - "Cách tạo playlist hay trên Spotify"
   
5. **Khuyến mãi** - Promotions
   - "Sale 50% tài khoản Netflix - Giới hạn 100 suất"

#### SEO Keywords Target
- "mua tài khoản netflix giá rẻ"
- "spotify premium giá rẻ"
- "hướng dẫn sử dụng netflix"
- "cách xem netflix trên tivi"
- "review tài khoản netflix shared"

---

### 7. FEATURES NÂNG CAO (Phase 2)

#### A. Newsletter Subscription
- Subscribe form trong blog
- Email list management
- Send new post notifications

#### B. Reading Time
- Tự động tính toán thời gian đọc
- Display: "5 phút đọc"

#### C. Bookmark/Save Post
- User có thể save bài viết yêu thích
- Manage saved posts trong profile

#### D. Post Reactions
- Like/Heart button
- Reaction count

#### E. Related Products
- Recommend sản phẩm liên quan trong post
- CTA buttons to product pages

#### F. Author Dashboard
- Author có thể quản lý bài viết của mình
- Analytics: views, comments, shares

---

## 🔧 TECH STACK

### Content Editor
- **Option 1**: TipTap Editor (recommended)
  - Modern, extensible
  - Good TypeScript support
  - Many extensions
  
- **Option 2**: React Quill
  - Popular, stable
  - Rich features

### Image Handling
- UploadThing hoặc Cloudinary
- Next.js Image optimization
- WebP format

### Search
- PostgreSQL full-text search
- Highlight matching text

### Markdown Support
- MDX hoặc react-markdown (optional)
- Syntax highlighting với Prism.js

---

## 📦 IMPLEMENTATION PLAN

### Phase 1: Core Blog (2-3 days)
1. ✅ Database schema (Post, Category, Tag, Comment)
2. ✅ Prisma migration
3. ✅ Admin: Posts CRUD
4. ✅ Admin: Categories & Tags management
5. ✅ Public: Blog homepage
6. ✅ Public: Single post page
7. ✅ Public: Category & tag pages

### Phase 2: Rich Editor & SEO (1-2 days)
1. ✅ Integrate TipTap editor
2. ✅ Image upload functionality
3. ✅ SEO meta tags
4. ✅ Sitemap generation
5. ✅ Structured data (JSON-LD)
6. ✅ Share buttons

### Phase 3: Comments & Engagement (1 day)
1. ✅ Comment system
2. ✅ Admin comment moderation
3. ✅ Reply to comments
4. ✅ View count tracking

### Phase 4: Advanced Features (1 day)
1. ✅ Search functionality
2. ✅ Table of Contents
3. ✅ Related posts
4. ✅ Reading time
5. ✅ Social sharing

---

## 🎨 UI/UX MOCKUP IDEAS

### Blog Homepage Layout
```
┌─────────────────────────────────────────────────┐
│              HERO FEATURED POST                 │
│  [Large Image]                                  │
│  [Category] Featured Title                      │
│  [Excerpt]                          [Read More] │
└─────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────┐
│ [Post Card 1]   │ [Post Card 2]   │ [Post Card 3]│
│ [Image]         │ [Image]         │ [Image]      │
│ Title           │ Title           │ Title        │
│ Excerpt         │ Excerpt         │ Excerpt      │
└─────────────────┴─────────────────┴─────────────┘

SIDEBAR:
- Categories
- Popular Posts
- Recent Posts
- Tags
```

### Single Post Layout
```
┌─────────────────────────────────────────────────┐
│  Home > Blog > Category > Post Title (Breadcrumbs)│
└─────────────────────────────────────────────────┘

┌──────────────────────────────┬─────────────────┐
│  POST TITLE                  │  [TOC]          │
│  By Author | Date | Category │  - Heading 1    │
│  [Featured Image]            │  - Heading 2    │
│                              │  - Heading 3    │
│  [Post Content]              │                 │
│  Paragraph...                │  POPULAR POSTS  │
│  ## Heading                  │  - Post 1       │
│  More content...             │  - Post 2       │
│                              │                 │
│  [Tags] [Share Buttons]      │  CATEGORIES     │
│                              │  - Cat 1        │
│  RELATED POSTS               │  - Cat 2        │
│  [Card] [Card] [Card]        │                 │
│                              │                 │
│  COMMENTS (5)                │                 │
│  [Comment 1]                 │                 │
│  [Comment 2]                 │                 │
│  [Add Comment Form]          │                 │
└──────────────────────────────┴─────────────────┘
```

---

## ✅ ACCEPTANCE CRITERIA

### Must Have
- [ ] Admin có thể tạo, sửa, xóa bài viết
- [ ] Rich text editor với images
- [ ] Categories và tags management
- [ ] Public blog homepage với danh sách bài viết
- [ ] Single post page với full content
- [ ] SEO meta tags cho mỗi post
- [ ] Responsive design (mobile-friendly)
- [ ] Comment system với moderation
- [ ] Search functionality
- [ ] View count tracking

### Nice to Have
- [ ] Sitemap.xml auto-generate
- [ ] Newsletter subscription
- [ ] Social sharing analytics
- [ ] Reading time calculation
- [ ] Bookmark/save posts
- [ ] Author dashboard

---

## 🚀 NEXT STEPS

Bạn có muốn bắt đầu implement Blog System không? Tôi sẽ:

1. ✅ Thêm Prisma schema cho Post, Category, Tag, Comment
2. ✅ Chạy migration
3. ✅ Tạo admin pages cho posts management
4. ✅ Implement rich text editor
5. ✅ Tạo public blog pages
6. ✅ SEO optimization

Bạn có muốn thay đổi/thêm gì vào kế hoạch này không?
