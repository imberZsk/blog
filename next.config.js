/** @type {import('next').NextConfig} */
const nextConfig = {
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
