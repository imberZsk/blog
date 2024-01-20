/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'sns-webpic-qc.xhscdn.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
