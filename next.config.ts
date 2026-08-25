import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
    images: {
       unoptimized: true,
        remotePatterns: [
    
         {
        protocol: 'https',
        hostname: 'admin.masheha.com',
        port: '',
        pathname: '/**', 
      },
       
    ],
    qualities: [75, 90], 
    domains: [], 
  },
  
};

export default nextConfig;


