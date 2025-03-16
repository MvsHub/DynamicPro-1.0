import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { connectToMongoDB } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

// Aumentar o timeout para evitar erros 504
export const maxDuration = 10 // 10 segundos

export async function POST(request: Request) {
  let connection = null

  try {
    // Obter dados do corpo da requisição
    const { name, email, password, role, formation, disciplines } = await request.json()

    // Validar campos obrigatórios
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Nome, email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Log para depuração
    console.log("Tentando registrar usuário:", { email, role })

    // Conectar ao MongoDB usando a função atualizada
    try {
      connection = await connectToMongoDB()
      const usersCollection = connection.db.collection("users")

      // Verificar se o email já está em uso
      const existingUser = await usersCollection.findOne({ email })

      if (existingUser) {
        return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 })
      }

      // Criptografar senha
      const hashedPassword = await hash(password, 10)

      // Inserir usuário
      const result = await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        role,
        formation: formation || "",
        disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
        createdAt: new Date(),
      })

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

      // Retornar token e dados do usuário
      return NextResponse.json({
        token,
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          role,
          formation: formation || "",
          disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
        },
      })
    } catch (dbError) {
      console.error("Erro ao conectar ou operar no MongoDB:", dbError)
      return NextResponse.json({ message: "Erro de conexão com o banco de dados" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao processar registro:", error)
    return NextResponse.json(
      {
        message: "Erro ao processar registro: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}




