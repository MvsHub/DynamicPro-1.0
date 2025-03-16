/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"],
  },
  // Configuração de output para o Vercel
  output: "standalone",
  // Configuração de redirecionamentos
  async redirects() {
    return [
      {
        source: "/",
        destination: "/app",
        permanent: false,
      },
    ]
  },
  // Configuração de reescritas
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/app/page",
      },
    ]
  },
}

module.exports = nextConfig

