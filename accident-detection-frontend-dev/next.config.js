/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config) => {
    config.output.publicPath = '/_next/';
    return config;
  },
};

module.exports = nextConfig;
