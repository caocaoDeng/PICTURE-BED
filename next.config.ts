import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // 静态导出
  output: 'export',
  basePath: '/pictureManager',
  distDir: 'build',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'raw.githubusercontent.com',
      },
      {
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

export default nextConfig
