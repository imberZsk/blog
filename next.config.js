/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://xxx.com/:path*' // 配置代理地址为 https://myplus-api.meizu.cn
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'sns-webpic-qc.xhscdn.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'ssm.res.meizu.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
