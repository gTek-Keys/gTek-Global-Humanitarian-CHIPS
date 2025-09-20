import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone build for Docker
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['gtek.global', 'databank.gtek.global'],
    unoptimized: false,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'gtek-global-humanitarian-chips',
  },
  
  // External packages for server components
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default nextConfig;
