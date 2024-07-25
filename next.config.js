/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  swcMinify: true,
  i18n,

  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.yvea.io/',
    BUCKETEER_URL: process.env.NEXT_PUBLIC_BUCKETEER_URL || 'https://bucketeer.yvea.io/',
    CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || 'd26p8ipa7on8uj.cloudfront.net',
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_CDN_URL || 'd26p8ipa7on8uj.cloudfront.net'],
  },
};

module.exports = nextConfig;
