/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"],
  },
  // Configurações para melhorar o tratamento de variáveis de ambiente
  serverRuntimeConfig: {
    // Variáveis disponíveis apenas no servidor
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig

