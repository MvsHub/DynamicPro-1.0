import { MongoClient } from "mongodb"

// Função para obter a URI do MongoDB corretamente
export const getMongoUri = () => {
  // Obter a URI do MongoDB da variável de ambiente
  const uri = process.env.MONGO_URI || ""

  // Log para depuração (será exibido apenas nos logs do servidor)
  console.log("MongoDB URI (primeiros caracteres):", uri ? uri.substring(0, 10) + "..." : "undefined")

  // Verificar se a URI contém o nome da variável (erro comum)
  if (uri.startsWith("MONGO_URI=")) {
    return uri.substring("MONGO_URI=".length)
  }

  return uri
}

// Cache de conexão para reutilizar a conexão entre requisições
let cachedClient: MongoClient | null = null
let cachedDb: any = null

// Função para conectar ao MongoDB com cache de conexão
export async function connectToMongoDB() {
  const uri = getMongoUri()

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
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })

    await client.connect()
    const db = client.db("dynamicpro")

    // Armazenar em cache para reutilização
    cachedClient = client
    cachedDb = db

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

