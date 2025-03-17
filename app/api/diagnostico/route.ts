import { NextResponse } from "next/server"
import { MongoClient, ServerApiVersion } from "mongodb"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Reduzir o timeout para evitar FUNCTION_INVOCATION_TIMEOUT
export const maxDuration = 5 // 5 segundos

// Função para testar a conexão com diferentes configurações
async function testConnection(options: any) {
  const uri = process.env.MONGO_URI || ""
  const startTime = Date.now()
  let client: MongoClient | null = null

  try {
    client = new MongoClient(uri, options)
    await client.connect()
    await client.db("admin").command({ ping: 1 })

    return {
      success: true,
      timeMs: Date.now() - startTime,
      options: { ...options, uri: undefined }, // Não retornar a URI por segurança
    }
  } catch (error) {
    return {
      success: false,
      timeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : String(error),
      options: { ...options, uri: undefined },
    }
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

export async function GET() {
  const uri = process.env.MONGO_URI || ""

  // Verificações básicas
  const basicChecks = {
    uri_provided: Boolean(uri),
    uri_format_valid: uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"),
    uri_length: uri.length,
    uri_sample: uri ? `${uri.substring(0, 10)}...${uri.substring(uri.length - 5)}` : "não fornecida",
    environment: process.env.NODE_ENV || "não definido",
    vercel_region: process.env.VERCEL_REGION || "não definido",
    jwt_secret_configured: Boolean(process.env.JWT_SECRET),
  }

  // Se a URI não for válida, retornar apenas as verificações básicas
  if (!basicChecks.uri_provided || !basicChecks.uri_format_valid) {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      basic_checks: basicChecks,
      message: "URI do MongoDB não fornecida ou inválida",
    })
  }

  // Testar diferentes configurações de conexão
  const testResults = await Promise.allSettled([
    // Teste 1: Configuração mínima
    testConnection({
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    }),

    // Teste 2: Com opções SSL
    testConnection({
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
      ssl: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
    }),

    // Teste 3: Com ServerAPI v1
    testConnection({
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    }),

    // Teste 4: Configuração completa otimizada
    testConnection({
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 2000,
      socketTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000,
      ssl: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      maxPoolSize: 1,
      minPoolSize: 0,
    }),
  ])

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    basic_checks: basicChecks,
    test_results: testResults,
    message: "Diagnóstico completo da conexão MongoDB",
  })
}

