import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const { name, email, password, role, formation, disciplines } = await request.json()

    // Validar campos obrigatórios
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Nome, email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Simular um ID de usuário
    const userId = Date.now().toString()

    // Gerar token JWT
    const token = sign(
      {
        id: userId,
        email,
        role,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" },
    )

    // Retornar token e dados do usuário
    return NextResponse.json({
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        formation: formation || "",
        disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
      },
    })
  } catch (error) {
    console.error("Erro ao processar registro mock:", error)
    return NextResponse.json(
      {
        message: "Erro ao processar registro",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

