import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { getMongoUri } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const uri = getMongoUri()
  let client: MongoClient | null = null

  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Nome, email, senha e função são obrigatórios" }, { status: 400 })
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

    // Verificar se o email já está em uso
    const existingUser = await usersCollection.findOne({
      email,
      role,
    })

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
      },
    })
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ message: "Erro ao processar registro" }, { status: 500 })
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

