import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function GET() {
  const uri = process.env.MONGO_URI || ""
  let client: MongoClient | null = null

  try {
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

    // Tentar conectar ao MongoDB
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })

    await client.connect()
    await client.db("admin").command({ ping: 1 })

    // Verificar se o banco de dados dynamicpro existe
    const adminDb = client.db("admin")
    const dbs = await adminDb.admin().listDatabases()
    const dbNames = dbs.databases.map((db: any) => db.name)
    const hasDynamicProDb = dbNames.includes("dynamicpro")

    return NextResponse.json({
      success: true,
      message: "Conexão bem-sucedida",
      uri_provided: true,
      uri_format: "válido",
      uri_sample: uri.substring(0, 10) + "...",
      databases: dbNames,
      has_dynamicpro_db: hasDynamicProDb,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      uri_provided: uri ? true : false,
      uri_format: uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://") ? "válido mas com erro" : "inválido",
      uri_sample: uri ? uri.substring(0, 10) + "..." : "não fornecida",
      timestamp: new Date().toISOString(),
    })
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


