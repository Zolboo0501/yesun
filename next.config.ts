import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: "/Users/zolboo/Documents/yesun",
  },
};

export default nextConfig;
