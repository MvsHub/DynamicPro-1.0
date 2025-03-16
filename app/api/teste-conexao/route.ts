import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Reduzir o timeout para evitar FUNCTION_INVOCATION_TIMEOUT
export const maxDuration = 3 // 3 segundos

export async function GET() {
  const startTime = Date.now()
  const uri = process.env.MONGO_URI || ""
  let client: MongoClient | null = null

  // Verificações básicas
  if (!uri) {
    return NextResponse.json({
      success: false,
      message: "URI do MongoDB não configurada",
      time_ms: Date.now() - startTime,
    })
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    return NextResponse.json({
      success: false,
      message: "Formato de URI inválido",
      uri_sample: uri.substring(0, 10) + "...",
      time_ms: Date.now() - startTime,
    })
  }

  try {
    // Tentar conectar com configurações otimizadas
    client = new MongoClient(uri, {
      connectTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000,
      socketTimeoutMS: 2000,
      ssl: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      maxPoolSize: 1,
    })

    // Medir tempo de conexão
    const connectStartTime = Date.now()
    await client.connect()
    const connectTime = Date.now() - connectStartTime

    // Medir tempo de ping
    const pingStartTime = Date.now()
    await client.db("admin").command({ ping: 1 })
    const pingTime = Date.now() - pingStartTime

    return NextResponse.json({
      success: true,
      message: "Conexão bem-sucedida",
      timings: {
        total_ms: Date.now() - startTime,
        connect_ms: connectTime,
        ping_ms: pingTime,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Falha na conexão",
        error: error instanceof Error ? error.message : String(error),
        time_ms: Date.now() - startTime,
      },
      { status: 500 },
    )
  } finally {
    if (client) {
      try {
        await client.close()
      } catch (e) {
        // Ignorar erros ao fechar
      }
    }
  }
}

