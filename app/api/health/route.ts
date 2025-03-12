import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API do Dynamic Pro está funcionando!",
    timestamp: new Date().toISOString(),
  })
}

