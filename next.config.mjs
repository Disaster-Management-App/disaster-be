/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow cross-origin requests from local network IPs during development
  experimental: {
    allowedDevOrigins: [
      'localhost',
      '127.0.0.1',
      '192.168.8.118', // Add your specific IP
      '192.168.1.0/24', // Allow 192.168.1.x subnet
      '192.168.8.0/24', // Allow 192.168.8.x subnet
      '10.0.0.0/8', // Allow 10.x.x.x private network
    ],
  },
}

export default nextConfig
