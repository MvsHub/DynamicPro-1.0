import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { verify } from "jsonwebtoken"
import { headers } from "next/headers"
import { connectToMongoDB } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  let connection = null

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

    // Conectar ao MongoDB usando a função atualizada
    try {
      connection = await connectToMongoDB()
      const usersCollection = connection.db.collection("users")

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
    } catch (dbError) {
      console.error("Erro ao conectar ou operar no MongoDB:", dbError)
      return NextResponse.json({ message: "Erro de conexão com o banco de dados" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao verificar token:", error)
    return NextResponse.json({ message: "Token inválido" }, { status: 401 })
  }
}

