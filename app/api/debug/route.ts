import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// Configuração para forçar modo dinâmico e evitar pré-renderização estática
export const dynamic = "force-dynamic"

export async function GET() {
  // Obter a URI do MongoDB da variável de ambiente
  const uri = process.env.MONGO_URI || ""

  // Informações sobre a URI
  const uriInfo = {
    provided: uri ? true : false,
    length: uri.length,
    starts_with_mongodb: uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"),
    contains_password: uri.includes(":") && uri.includes("@"),
    sample: uri ? `${uri.substring(0, 15)}...${uri.substring(uri.length - 10)}` : "not provided",
  }

  // Informações sobre o ambiente
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV || "not set",
    VERCEL_ENV: process.env.VERCEL_ENV || "not set",
    VERCEL_REGION: process.env.VERCEL_REGION || "not set",
    JWT_SECRET: process.env.JWT_SECRET ? "configured" : "missing",
  }

  // Tentar conectar ao MongoDB
  const dbInfo: {
    connection_attempted: boolean
    connection_successful: boolean
    error: string | null
    databases: string[]
    collections: string[]
  } = {
    connection_attempted: false,
    connection_successful: false,
    error: null,
    databases: [],
    collections: [],
  }

  if (uriInfo.provided && uriInfo.starts_with_mongodb) {
    dbInfo.connection_attempted = true

    try {
      // Criar cliente MongoDB com timeout curto
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })

      // Tentar conectar
      await client.connect()

      // Verificar conexão com ping
      await client.db("admin").command({ ping: 1 })

      // Conexão bem-sucedida
      dbInfo.connection_successful = true

      // Listar bancos de dados
      const dbs = await client.db().admin().listDatabases()
      dbInfo.databases = dbs.databases.map((db: any) => db.name) as string[]

      // Verificar se o banco de dados dynamicpro existe
      if (dbInfo.databases.includes("dynamicpro")) {
        // Listar coleções
        const collections = await client.db("dynamicpro").listCollections().toArray()
        dbInfo.collections = collections.map((col) => col.name)
      }

      // Fechar conexão
      await client.close()
    } catch (error) {
      // Erro de conexão
      dbInfo.error = error instanceof Error ? error.message : String(error)
    }
  }

  // Retornar todas as informações
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    uri_info: uriInfo,
    environment: envInfo,
    database: dbInfo,
  })
}


