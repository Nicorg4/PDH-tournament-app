/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pdh-tournament-app-server-production.up.railway.app",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3003",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
