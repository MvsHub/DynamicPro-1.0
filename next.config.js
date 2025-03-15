/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"],
  },
  // Configuração de output para o Vercel
  output: "standalone",
}

module.exports = nextConfig

