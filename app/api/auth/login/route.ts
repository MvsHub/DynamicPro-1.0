import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { connectToMongoDB } from "@/lib/mongodb-serverless"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Conectar ao MongoDB usando a função atualizada
    const { client, mock } = await connectToMongoDB()

    // Se estamos no modo mock, usar implementação mock
    if (mock || !client) {
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
    }

    // Se chegamos aqui, temos uma conexão real com o MongoDB
    try {
      const db = client.db("dynamicpro")
      const usersCollection = db.collection("users")

      // Buscar usuário
      const user = await usersCollection.findOne({
        email,
        role,
      })

      if (!user) {
        return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
      }

      // Verificar senha
      const isPasswordValid = await compare(password, user.password)

      if (!isPasswordValid) {
        return NextResponse.json({ message: "Senha incorreta" }, { status: 401 })
      }

      // Gerar token JWT
      const token = sign(
        {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" },
      )

      // Retornar token e dados do usuário
      return NextResponse.json({
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          formation: user.formation || "",
          disciplines: user.disciplines || [],
        },
      })
    } catch (dbError) {
      console.error("Erro ao conectar ou operar no MongoDB:", dbError)

      // Fallback para modo mock em caso de erro
      const userId = `mock_${role}_${Date.now()}`
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
        fallback: true,
      })
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro ao processar login" }, { status: 500 })
  }
}






