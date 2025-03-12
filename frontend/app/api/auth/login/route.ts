import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

// Conexão com MongoDB
const uri = process.env.MONGO_URI || ""

export async function POST(request: Request) {
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    const { email, password, role } = body

    await client.connect()
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
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
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

    // Retornar usuário e token
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Erro ao processar login:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await client.close()
  }
}

