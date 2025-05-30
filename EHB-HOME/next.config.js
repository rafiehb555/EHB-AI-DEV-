/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      // Add any necessary rewrites here
    ];
  },
};

module.exports = nextConfig;
