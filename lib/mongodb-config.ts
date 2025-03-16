import { MongoClient, type MongoClientOptions } from "mongodb"

// Configuração segura para o MongoDB
const mongoConfig: MongoClientOptions = {
  // Timeouts razoáveis
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,

  // Configurações de conexão
  maxPoolSize: 10,
  minPoolSize: 1,

  // Configurações de retry
  retryWrites: true,
  retryReads: true,

  // Configurações de TLS/SSL
  tls: true,
  tlsCAFile: undefined, // Usar certificados CA padrão
}

// Cache de conexão para reutilizar a conexão entre requisições
let cachedClient: MongoClient | null = null
let cachedDb: any = null

// Função para conectar ao MongoDB com cache de conexão
export async function connectToMongoDB() {
  const uri = process.env.MONGO_URI || ""

  // Verificar se a URI é válida
  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
    throw new Error("MongoDB URI inválida ou não configurada")
  }

  // Se já temos uma conexão em cache, reutilizá-la
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Criar uma nova conexão
  try {
    const client = new MongoClient(uri, mongoConfig)
    await client.connect()

    const db = client.db("dynamicpro")

    // Verificar conexão com ping
    await db.command({ ping: 1 })

    // Armazenar em cache para reutilização
    cachedClient = client
    cachedDb = db

    console.log("Conexão com MongoDB estabelecida com sucesso")

    return { client, db }
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error)
    throw error
  }
}

// Função para obter uma coleção específica
export async function getCollection(collectionName: string) {
  try {
    const { db } = await connectToMongoDB()
    return db.collection(collectionName)
  } catch (error) {
    console.error(`Erro ao obter coleção ${collectionName}:`, error)
    throw error
  }
}

// Função para fechar a conexão (útil para testes)
export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}

