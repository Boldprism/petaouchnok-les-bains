headers: async () => [{
  source: '/_next/static/:path*',
  headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
}]
  import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
};

export default nextConfig;
