import { MongoClient, ServerApiVersion } from "mongodb"

// Cache de conexão para reutilizar entre invocações de função
let cachedClient: MongoClient | null = null
let isUsingMockMode = false

export async function connectToMongoDB() {
  // Se já temos uma conexão em cache, reutilizá-la
  if (cachedClient) {
    return { client: cachedClient, mock: isUsingMockMode }
  }

  const uri = process.env.MONGO_URI

  if (!uri) {
    console.log("MONGO_URI não está definida, usando modo mock")
    isUsingMockMode = true
    return { client: null, mock: true }
  }

  try {
    // Criar cliente com opções otimizadas para serverless
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: false,
      },
      // Timeouts curtos para falhar rápido
      connectTimeoutMS: 2000,
      socketTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000,
      // Opções para lidar com problemas de SSL
      ssl: true,
      tlsInsecure: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      maxPoolSize: 1,
      minPoolSize: 0,
    })

    // Tentar conectar ao cliente
    await client.connect()

    // Armazenar em cache para reutilização
    cachedClient = client
    isUsingMockMode = false

    return { client, mock: false }
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error)
    isUsingMockMode = true
    return { client: null, mock: true }
  }
}

// Função para obter uma coleção específica
export async function getCollection(collectionName: string) {
  try {
    const { client, mock } = await connectToMongoDB()

    if (mock) {
      // Retornar uma implementação mock da coleção
      return getMockCollection(collectionName)
    }

    return client!.db("dynamicpro").collection(collectionName)
  } catch (error) {
    console.error(`Erro ao obter coleção ${collectionName}:`, error)
    return getMockCollection(collectionName)
  }
}

// Implementação mock de coleção
function getMockCollection(collectionName: string) {
  // Armazenamento em memória para dados mock
  const mockData: Record<string, any[]> = {
    users: [],
  }

  // Garantir que a coleção existe no armazenamento mock
  if (!mockData[collectionName]) {
    mockData[collectionName] = []
  }

  // Retornar uma implementação mock da API de coleção do MongoDB
  return {
    findOne: async (query: any) => {
      console.log(`[MOCK] findOne em ${collectionName}:`, query)
      return (
        mockData[collectionName].find((item) => Object.keys(query).every((key) => item[key] === query[key])) || null
      )
    },
    find: async (query: any) => {
      console.log(`[MOCK] find em ${collectionName}:`, query)
      const results = mockData[collectionName].filter((item) =>
        Object.keys(query).every((key) => item[key] === query[key]),
      )
      return {
        toArray: async () => results,
      }
    },
    insertOne: async (doc: any) => {
      console.log(`[MOCK] insertOne em ${collectionName}:`, doc)
      const id = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const docWithId = { ...doc, _id: id }
      mockData[collectionName].push(docWithId)
      return { insertedId: id, acknowledged: true }
    },
    updateOne: async (query: any, update: any) => {
      console.log(`[MOCK] updateOne em ${collectionName}:`, query, update)
      return { modifiedCount: 1, acknowledged: true }
    },
    deleteOne: async (query: any) => {
      console.log(`[MOCK] deleteOne em ${collectionName}:`, query)
      return { deletedCount: 1, acknowledged: true }
    },
  }
}

// Função para fechar a conexão (útil para testes)
export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
  }
}
