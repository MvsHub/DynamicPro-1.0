import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import { verify } from "jsonwebtoken"
import { headers } from "next/headers"

// Conexão com MongoDB
const uri = process.env.MONGO_URI || ""

export async function GET(request: Request) {
  const client = new MongoClient(uri)

  try {
    const headersList = headers()
    const authorization = headersList.get("Authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token não fornecido" }, { status: 401 })
    }

    const token = authorization.split(" ")[1]

    // Verificar token
    const decoded = verify(token, process.env.JWT_SECRET || "secret") as {
      id: string
      email: string
      role: string
    }

    await client.connect()
    const db = client.db("dynamicpro")
    const usersCollection = db.collection("users")

    // Buscar usuário
    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.id),
    })

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 })
    }

    // Retornar usuário
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return NextResponse.json({ message: "Token inválido" }, { status: 401 })
  } finally {
    await client.close()
  }
}

