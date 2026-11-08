import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["192.168.1.2"],
  // The two greeting pages now live on the team page (since 2026-11-09).
  async redirects() {
    return [
      { source: "/greeting/director", destination: "/ourTeam", permanent: true },
      { source: "/greeting/engineering", destination: "/ourTeam#engineers", permanent: true },
    ];
  },
};

export default nextConfig;
