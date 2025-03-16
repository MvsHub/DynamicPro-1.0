import { NextResponse } from "next/server"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function GET() {
  const mongoUri = process.env.MONGO_URI || ""
  const jwtSecret = process.env.JWT_SECRET || ""

  return NextResponse.json({
    mongo_uri_configured: mongoUri ? true : false,
    mongo_uri_length: mongoUri.length,
    mongo_uri_starts_with_mongodb: mongoUri.startsWith("mongodb://") || mongoUri.startsWith("mongodb+srv://"),
    jwt_secret_configured: jwtSecret ? true : false,
    node_env: process.env.NODE_ENV || "not set",
    timestamp: new Date().toISOString(),
  })
}

