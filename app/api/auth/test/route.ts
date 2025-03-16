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
  const uriDetails = {
    valid: false,
    format: "unknown",
    value: "not provided",
    length: 0,
  }

  // Verificar se a URI do MongoDB está configurada corretamente
  if (uri) {
    uriDetails.length = uri.length
    uriDetails.value = uri.substring(0, 10) + "..." + uri.substring(uri.length - 5)

    if (uri.startsWith("mongodb://")) {
      uriDetails.valid = true
      uriDetails.format = "mongodb://"
    } else if (uri.startsWith("mongodb+srv://")) {
      uriDetails.valid = true
      uriDetails.format = "mongodb+srv://"
    }
  }

  if (uriDetails.valid) {
    try {
      // Tentar conectar ao MongoDB com timeout reduzido
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })

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
        environment: process.env.NODE_ENV || "development",
        mongodb: {
          status: mongoStatus,
          uri: uriDetails,
          collections: collections.map((c) => c.name),
          has_users_collection: hasUsersCollection,
        },
        jwt_secret: process.env.JWT_SECRET ? "configured" : "missing",
        env_vars: {
          NODE_ENV: process.env.NODE_ENV || "not set",
          MONGO_URI: "configured with length " + uriDetails.length,
          JWT_SECRET: process.env.JWT_SECRET ? "configured" : "missing",
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
      environment: process.env.NODE_ENV || "development",
      mongodb: {
        status: mongoStatus,
        uri: uriDetails,
        error: errorDetails,
      },
      jwt_secret: process.env.JWT_SECRET ? "configured" : "missing",
      env_vars: {
        NODE_ENV: process.env.NODE_ENV || "not set",
        MONGO_URI: uri ? "configured with length " + uriDetails.length : "not set",
        JWT_SECRET: process.env.JWT_SECRET ? "configured" : "missing",
      },
    },
    { status: 500 },
  )
}


