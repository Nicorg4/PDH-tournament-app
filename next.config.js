/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pdh-tournament-app-server-production.up.railway.app",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
