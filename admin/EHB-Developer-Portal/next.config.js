/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [
      // Proxy API requests to the backend server
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
      // Proxy requests to the EHB-HOME service
      {
        source: '/home/:path*',
        destination: 'http://localhost:5005/:path*',
      },
      // Proxy requests to the GoSellr service
      {
        source: '/gosellr/:path*',
        destination: 'http://localhost:5002/:path*',
      },
    ];
  },
  // Handle CORS and external origins for development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;