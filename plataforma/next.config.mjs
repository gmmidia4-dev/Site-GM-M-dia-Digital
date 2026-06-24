/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  experimental: {
    // @react-pdf/renderer ships native ESM that must be transpiled for RSC/server actions
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
}

export default nextConfig
