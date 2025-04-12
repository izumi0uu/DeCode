/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:1337/api/:path*",
      },
      {
        source: "/web3auth/:path*",
        destination: "https://api.web3auth.io/:path*",
      },
      {
        source: "/ethereum-rpc/:path*",
        destination: "https://eth-mainnet.g.alchemy.com/v2/demo/:path*",
      },
    ];
  },
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
