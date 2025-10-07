/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "pino-pretty": false,
      "pino-abstract-transport": false,
      "sonic-boom": false,
    };
    return config;
  },
};
export default nextConfig;
