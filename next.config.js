/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"],
  },
  experimental: {
    appDir: true,
  },
  // Configurações para melhorar o tratamento de variáveis de ambiente
  serverRuntimeConfig: {
    // Variáveis disponíveis apenas no servidor
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  // Desabilitar análise estática para rotas API
  webpack: (config) => {
    return config
  },
}

module.exports = nextConfig

