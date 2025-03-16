import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware simplificado para evitar possíveis erros
export function middleware(request: NextRequest) {
  // Obter a resposta original
  const response = NextResponse.next()

  // Adicionar cabeçalhos de CORS
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return response
}

// Aplicar apenas a rotas específicas para reduzir impacto
export const config = {
  matcher: ["/api/:path*"],
}




