import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pdbeznfimxjzmyhtchov.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  eslint: {
    // ✅ Skip all ESLint errors/warnings during build
    ignoreDuringBuilds: true,
  },
  
};


export default nextConfig;
