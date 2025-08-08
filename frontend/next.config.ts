import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['www.geoface.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io"
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh" // allow all ufs.sh subdomains
      }
    ]
  },
};

export default nextConfig;
