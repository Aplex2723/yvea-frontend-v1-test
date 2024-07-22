/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n,

  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    BUCKETEER_URL: process.env.NEXT_PUBLIC_BUCKETEER_URL,
    CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_CDN_URL || ''],
  },
};

module.exports = nextConfig;
