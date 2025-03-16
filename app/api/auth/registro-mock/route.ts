import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import { hash } from "bcryptjs"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Armazenamento em memória para usuários (apenas para desenvolvimento)
// Nota: Isso será perdido quando a função serverless for reiniciada
const users: any[] = []

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const { name, email, password, role, formation, disciplines } = await request.json()

    // Validar campos obrigatórios
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Nome, email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Verificar se o email já está em uso
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 })
    }

    // Criptografar senha
    const hashedPassword = await hash(password, 10)

    // Criar ID único
    const userId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    // Criar novo usuário
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      role,
      formation: formation || "",
      disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao armazenamento em memória
    users.push(newUser)

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

    // Retornar token e dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      token,
      user: userWithoutPassword,
      mock: true, // Indicar que é um mock
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

