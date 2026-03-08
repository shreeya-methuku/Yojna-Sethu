/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images/media from external sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'archive.org' },
    ],
  },
  // Required for AWS Amplify deployment
  output: 'standalone',
};

module.exports = nextConfig;
