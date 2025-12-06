/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'uploadthing.com', 'utfs.io'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
