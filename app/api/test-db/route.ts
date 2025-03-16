import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { getMongoUri } from "@/lib/mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function GET() {
  const uri = getMongoUri()
  let client: MongoClient | null = null
  let mongoStatus = "unknown"
  let errorDetails = null

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

      // Verificar se a coleção users existe
      const collections = await db.listCollections().toArray()
      const hasUsersCollection = collections.some((col) => col.name === "users")

      mongoStatus = "connected"

      return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        mongodb: {
          configured: true,
          status: mongoStatus,
          uri_valid: isMongoUriValid,
          collections: collections.map((c) => c.name),
          has_users_collection: hasUsersCollection,
        },
      })
    } catch (error) {
      console.error("Erro ao verificar conexão com MongoDB:", error)
      mongoStatus = "error"
      errorDetails = error instanceof Error ? error.message : String(error)
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

  return NextResponse.json(
    {
      status: "error",
      timestamp: new Date().toISOString(),
      mongodb: {
        configured: isMongoUriValid,
        status: mongoStatus,
        uri_valid: isMongoUriValid,
        error: errorDetails,
      },
    },
    { status: mongoStatus === "invalid_uri" ? 500 : 200 },
  )
}

