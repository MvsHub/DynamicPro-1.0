import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Usuários mock para teste
const mockUsers = [
  {
    id: "mock_teacher_1",
    name: "Professor Teste",
    email: "professor@teste.com",
    password: "senha123",
    role: "teacher",
    formation: "Doutorado em Educação",
    disciplines: ["Matemática", "Física"],
  },
  {
    id: "mock_student_1",
    name: "Aluno Teste",
    email: "aluno@teste.com",
    password: "senha123",
    role: "student",
    formation: "Ensino Médio",
    disciplines: [],
  },
]

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Permitir login com qualquer email/senha para fins de teste
    // Em um ambiente de produção, você validaria as credenciais

    // Criar um ID único baseado no email e na função
    const userId = `mock_${role}_${Date.now()}`

    // Criar um nome baseado na função
    const name = email.split("@")[0] + (role === "teacher" ? " (Professor)" : " (Aluno)")

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
        formation: role === "teacher" ? "Formação Acadêmica" : "Estudante",
        disciplines: role === "teacher" ? ["Disciplina Teste"] : [],
      },
      mock: true,
    })
  } catch (error) {
    console.error("Erro ao processar login mock:", error)
    return NextResponse.json(
      {
        message: "Erro ao processar login",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

