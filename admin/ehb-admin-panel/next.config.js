
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://0.0.0.0:5001/api/:path*'
      }
    ]
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.domain.com' 
      : 'http://0.0.0.0:5001'
  }
}

module.exports = nextConfig
