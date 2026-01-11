#!/bin/bash

# Create blog tables using raw SQL

SERVER_IP="139.59.111.150"
SERVER_USER="root"

echo "🗄️  Creating blog tables with SQL..."
echo ""

ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'

cd /var/www/selldigital

echo "📝 Executing SQL to create blog tables..."

npx prisma db execute --stdin <<'SQL'

-- PostCategory table
CREATE TABLE IF NOT EXISTS "PostCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PostCategory_slug_key" ON "PostCategory"("slug");
CREATE INDEX IF NOT EXISTS "PostCategory_order_idx" ON "PostCategory"("order");

-- Tag table
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Tag_slug_key" ON "Tag"("slug");

-- Post table
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Post_slug_key" ON "Post"("slug");
CREATE INDEX IF NOT EXISTS "Post_categoryId_idx" ON "Post"("categoryId");
CREATE INDEX IF NOT EXISTS "Post_authorId_idx" ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS "Post_published_status_idx" ON "Post"("published", "status");
CREATE INDEX IF NOT EXISTS "Post_publishedAt_idx" ON "Post"("publishedAt");

-- PostTag junction table
CREATE TABLE IF NOT EXISTS "PostTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    PRIMARY KEY ("postId", "tagId")
);

CREATE INDEX IF NOT EXISTS "PostTag_tagId_idx" ON "PostTag"("tagId");

-- Comment table
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
CREATE INDEX IF NOT EXISTS "Comment_status_idx" ON "Comment"("status");

-- Foreign keys
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_categoryId_fkey') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" 
            FOREIGN KEY ("categoryId") REFERENCES "PostCategory"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Post_authorId_fkey') THEN
        ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" 
            FOREIGN KEY ("authorId") REFERENCES "User"("id") 
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PostTag_postId_fkey') THEN
        ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" 
            FOREIGN KEY ("postId") REFERENCES "Post"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PostTag_tagId_fkey') THEN
        ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" 
            FOREIGN KEY ("tagId") REFERENCES "Tag"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_postId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" 
            FOREIGN KEY ("postId") REFERENCES "Post"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_userId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Comment_parentId_fkey') THEN
        ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" 
            FOREIGN KEY ("parentId") REFERENCES "Comment"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

SQL

echo ""
echo "✅ Verifying tables:"
npx prisma db execute --stdin <<SQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Post', 'PostCategory', 'Tag', 'PostTag', 'Comment')
ORDER BY table_name;
SQL

echo ""
echo "🔄 Generating Prisma Client..."
npx prisma generate

echo ""
echo "♻️  Restarting app..."
pm2 restart selldigital

echo ""
pm2 list

ENDSSH

echo ""
echo "✅ Blog system ready on production!"
echo ""
echo "🌐 Test URLs:"
echo "   http://139.59.111.150:3000"
echo "   http://139.59.111.150:3000/blog"
echo "   http://139.59.111.150:3000/admin/blog/posts"
