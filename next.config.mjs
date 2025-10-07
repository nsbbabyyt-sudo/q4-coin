/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "pino-pretty": false,             // optional pretty printer
      "pino-abstract-transport": false, // sometimes pulled by pino
      "sonic-boom": false,              // rarely needed; safe to disable
    };
    return config;
  },
};
export default nextConfig;
