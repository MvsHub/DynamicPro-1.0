import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { getMongoUri } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const uri = getMongoUri()
  let client: MongoClient | null = null

  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ message: "Email, senha e função são obrigatórios" }, { status: 400 })
    }

    // Inicializar cliente MongoDB
    try {
      client = new MongoClient(uri)
      await client.connect()
    } catch (dbError) {
      console.error("Erro ao conectar ao MongoDB:", dbError)
      return NextResponse.json({ message: "Erro de conexão com o banco de dados" }, { status: 500 })
    }

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
      },
    })
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return NextResponse.json({ message: "Erro ao processar login" }, { status: 500 })
  } finally {
    if (client) {
      try {
        await client.close()
      } catch (closeError) {
        console.error("Erro ao fechar conexão MongoDB:", closeError)
      }
    }
  }
}



