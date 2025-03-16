import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { headers } from "next/headers"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("Authorization")
    const userRole = headersList.get("X-User-Role") || "student"

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]

    // Verificar token
    const decoded = verify(token, process.env.JWT_SECRET || "secret") as {
      id: string
      email: string
      role: string
    }

    // Usar a função do cabeçalho se disponível, caso contrário usar a do token
    const role = userRole || decoded.role

    // Retornar dados do usuário
    return NextResponse.json({
      user: {
        id: decoded.id,
        name: decoded.email.split("@")[0] + (role === "teacher" ? " (Professor)" : " (Aluno)"),
        email: decoded.email,
        role: role as "student" | "teacher",
        formation: role === "teacher" ? "Formação Acadêmica" : "Estudante",
        disciplines: role === "teacher" ? ["Disciplina Teste"] : [],
      },
      mock: true,
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return NextResponse.json({ message: "Token inválido" }, { status: 401 })
  }
}


