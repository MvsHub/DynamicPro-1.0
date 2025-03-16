import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { connectToMongoDB } from "@/lib/mongodb-serverless"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Reduzir o timeout para evitar FUNCTION_INVOCATION_TIMEOUT
export const maxDuration = 5 // 5 segundos

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const { name, email, password, role, formation, disciplines } = await request.json()

    // Validar campos obrigatórios
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Nome, email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Tentar conectar ao MongoDB
    const { client, mock } = await connectToMongoDB()

    // Se estamos no modo mock, usar implementação mock
    if (mock || !client) {
      // Criar ID único para modo mock
      const userId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      // Criptografar senha
      const hashedPassword = await hash(password, 10)

      // Criar novo usuário mock
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
        mock: true,
      })
    }

    // Se chegamos aqui, temos uma conexão real com o MongoDB
    try {
      const db = client.db("dynamicpro")
      const usersCollection = db.collection("users")

      // Verificar se o email já está em uso
      const existingUser = await usersCollection.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 })
      }

      // Criptografar senha
      const hashedPassword = await hash(password, 10)

      // Criar novo usuário
      const newUser = {
        name,
        email,
        password: hashedPassword,
        role,
        formation: formation || "",
        disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
        createdAt: new Date(),
      }

      // Inserir no banco de dados
      const result = await usersCollection.insertOne(newUser)

      // Gerar token JWT
      const token = sign(
        {
          id: result.insertedId.toString(),
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
        user: {
          id: result.insertedId.toString(),
          ...userWithoutPassword,
        },
      })
    } catch (dbError) {
      console.error("Erro ao operar no MongoDB:", dbError)

      // Fallback para modo mock em caso de erro
      return NextResponse.json(
        {
          message: "Erro de banco de dados, usando modo fallback",
          details: dbError instanceof Error ? dbError.message : String(dbError),
          fallback: true,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao processar registro:", error)
    return NextResponse.json(
      {
        message: "Erro ao processar registro",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}








