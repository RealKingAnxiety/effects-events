/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: true,   // This replaces the old ppr setting
  },
};

export default nextConfig;