import { NextResponse } from "next/server"

// Rota de verificação de saúde da API
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
}

