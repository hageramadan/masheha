/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev.masheha.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [],
  },
};

module.exports = nextConfig;