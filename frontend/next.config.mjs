/** @type {import('next').NextConfig} */
const nextConfig= {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8000/:path*' // Proxy to Backend
      }
    ]
  }
}
    export default nextConfig;