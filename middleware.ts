import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware simplificado para evitar possíveis erros
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

// Aplicar apenas a rotas específicas para reduzir impacto
export const config = {
  matcher: ["/api/:path*"],
}



