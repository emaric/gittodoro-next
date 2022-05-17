/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')

const nextConfig = withPWA({
  pwa: {
    dest: 'public',
  },
  experimental: {
    outputStandalone: true,
  },
  reactStrictMode: true,
  webpack: (config, { buildId, dev }) => {
    config.resolve.symlinks = false
    return config
  },
  images: {
    loader: 'imgix',
    path: '',
    domains: ['avatars.githubusercontent.com'],
  },
})

module.exports = nextConfig
