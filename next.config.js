/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dd1afbc334a5.ngrok-free.app",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
