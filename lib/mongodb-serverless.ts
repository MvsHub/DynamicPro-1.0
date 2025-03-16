import { MongoClient, ServerApiVersion } from "mongodb"

// Cache de conexão para reutilizar entre invocações de função
let cachedClient: MongoClient | null = null

export async function connectToMongoDB() {
  // Se já temos uma conexão em cache, reutilizá-la
  if (cachedClient) {
    return cachedClient
  }

  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error("MONGO_URI não está definida nas variáveis de ambiente")
  }

  try {
    // Criar cliente com opções otimizadas para serverless
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      // Timeouts curtos para falhar rápido em vez de atingir o limite do Vercel
      connectTimeoutMS: 2500,
      socketTimeoutMS: 2500,
      serverSelectionTimeoutMS: 2500,
      // Opções para lidar com problemas de SSL
      ssl: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      maxPoolSize: 1, // Limitar o tamanho do pool para ambientes serverless
      minPoolSize: 0, // Permitir que o pool fique vazio quando não estiver em uso
    })

    // Conectar ao cliente
    await client.connect()

    // Armazenar em cache para reutilização
    cachedClient = client

    return client
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error)
    throw error
  }
}

// Função para obter uma coleção específica
export async function getCollection(collectionName: string) {
  try {
    const client = await connectToMongoDB()
    return client.db("dynamicpro").collection(collectionName)
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
  }
}

