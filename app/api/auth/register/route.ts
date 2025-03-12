import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"

// Conexão com MongoDB
const uri = process.env.MONGO_URI || ""

export async function POST(request: Request) {
  const client = new MongoClient(uri)

  try {
    const body = await request.json()
    const { name, email, password, role, ...additionalData } = body

    await client.connect()
    const db = client.db("dynamicpro")
    const usersCollection = db.collection("users")

    // Verificar se o email já existe
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 })
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10)

    // Criar usuário
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      ...additionalData,
      createdAt: new Date(),
    }

    const result = await usersCollection.insertOne(userData)

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

    // Retornar usuário e token
    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        role,
      },
      token,
    })
  } catch (error) {
    console.error("Erro ao processar registro:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await client.close()
  }
}

