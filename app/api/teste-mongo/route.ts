import { NextResponse } from "next/server"
import { connectToMongoDB, closeConnection } from "@/lib/mongodb-config"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const uri = process.env.MONGO_URI || ""

    // Verificar se a URI está configurada
    if (!uri) {
      return NextResponse.json({
        success: false,
        error: "URI do MongoDB não configurada",
        uri_provided: false,
      })
    }

    // Verificar formato da URI
    if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
      return NextResponse.json({
        success: false,
        error: "Formato de URI inválido",
        uri_provided: true,
        uri_format: "inválido",
        uri_sample: uri.substring(0, 10) + "...",
      })
    }

    // Tentar conectar ao MongoDB usando a configuração segura
    const { client, db } = await connectToMongoDB()

    // Listar coleções para verificar a conexão
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    // Verificar se o banco de dados tem as coleções necessárias
    const hasUsersCollection = collectionNames.includes("users")

    // Fechar a conexão após o teste
    await closeConnection()

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB estabelecida com sucesso",
      uri_provided: true,
      uri_format: "válido",
      uri_sample: uri.substring(0, 10) + "...",
      collections: collectionNames,
      has_users_collection: hasUsersCollection,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Garantir que a conexão seja fechada em caso de erro
    await closeConnection()

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      uri_provided: process.env.MONGO_URI ? true : false,
      uri_format:
        process.env.MONGO_URI &&
        (process.env.MONGO_URI.startsWith("mongodb://") || process.env.MONGO_URI.startsWith("mongodb+srv://"))
          ? "válido mas com erro"
          : "inválido",
      uri_sample: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 10) + "..." : "não fornecida",
      timestamp: new Date().toISOString(),
    })
  }
}

