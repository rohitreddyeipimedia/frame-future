/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.openai.com', 'blog.openai.com', 'arxiv.org'],
  },
}

module.exports = nextConfig
