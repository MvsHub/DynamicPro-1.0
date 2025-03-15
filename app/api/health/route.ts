import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { getMongoUri } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function GET() {
  const uri = getMongoUri()
  let client: MongoClient | null = null
  let mongoStatus = "unknown"

  // Verificar se a URI do MongoDB está configurada corretamente
  const isMongoUriValid = uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))

  if (isMongoUriValid) {
    try {
      // Tentar conectar ao MongoDB
      client = new MongoClient(uri)
      await client.connect()

      // Verificar se podemos acessar o banco de dados
      const db = client.db("dynamicpro")
      await db.command({ ping: 1 })

      mongoStatus = "connected"
    } catch (error) {
      console.error("Erro ao verificar conexão com MongoDB:", error)
      mongoStatus = "error"
    } finally {
      if (client) {
        try {
          await client.close()
        } catch (closeError) {
          console.error("Erro ao fechar conexão MongoDB:", closeError)
        }
      }
    }
  } else {
    mongoStatus = "invalid_uri"
  }

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongodb: {
      configured: isMongoUriValid,
      status: mongoStatus,
    },
    version: "1.0.0",
  })
}

// Adicionar também um endpoint POST para testes mais completos
export async function POST() {
  return NextResponse.json({
    status: "ok",
    method: "POST",
    timestamp: new Date().toISOString(),
  })
}

