import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import { verify } from "jsonwebtoken"
import { headers } from "next/headers"
import { getMongoUri } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

// Conexão com MongoDB - Corrigir a leitura da variável de ambiente
const uri = getMongoUri()

// Verificar formato da URI
if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
  console.error("ERRO DE CONFIGURAÇÃO: MongoDB URI inválida ou não definida", {
    uri: uri ? uri.substring(0, 10) + "..." : "undefined",
  })
}

export async function GET(request: Request) {
  let client: MongoClient | null = null

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

    // Inicializar cliente MongoDB com tratamento de erro
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
    if (client) {
      try {
        await client.close()
      } catch (closeError) {
        console.error("Erro ao fechar conexão MongoDB:", closeError)
      }
    }
  }
}

