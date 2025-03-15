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
}

module.exports = nextConfig



