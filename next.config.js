/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    outputStandalone: true,
  },
  reactStrictMode: true,
  webpack: (config, { buildId, dev }) => {
    config.resolve.symlinks = false
    return config
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

module.exports = nextConfig
