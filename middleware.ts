import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log para depuração
  console.log("Middleware executado:", request.nextUrl.pathname)

  // Continuar normalmente
  return NextResponse.next()
}

// Configurar para executar em todas as rotas
export const config = {
  matcher: "/:path*",
}

