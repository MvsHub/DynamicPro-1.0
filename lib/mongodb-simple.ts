import { MongoClient } from "mongodb"

// Função para obter a URI do MongoDB
export function getMongoUri() {
  return process.env.MONGO_URI || ""
}

// Função para testar a conexão com o MongoDB
export async function testMongoConnection() {
  const uri = getMongoUri()

  if (!uri) {
    return {
      success: false,
      error: "URI não fornecida",
      uri_provided: false,
    }
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    return {
      success: false,
      error: "Formato de URI inválido",
      uri_provided: true,
      uri_format: "inválido",
    }
  }

  let client: MongoClient | null = null

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })

    await client.connect()
    await client.db("admin").command({ ping: 1 })

    return {
      success: true,
      message: "Conexão bem-sucedida",
      uri_provided: true,
      uri_format: "válido",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      uri_provided: true,
      uri_format: "válido mas com erro",
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

