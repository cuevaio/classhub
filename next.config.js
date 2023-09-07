/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['us-east-1.storage.xata.sh'],
  },
};

module.exports = nextConfig;
