import { MongoClient } from "mongodb"

// Função para obter a URI do MongoDB corretamente
export const getMongoUri = () => {
  const uri = process.env.MONGO_URI || ""
  // Verificar se a URI contém o nome da variável (erro comum)
  if (uri.startsWith("MONGO_URI=")) {
    return uri.substring("MONGO_URI=".length)
  }
  return uri
}

// Verificar formato da URI
const uri = getMongoUri()
if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) {
  console.error("ERRO DE CONFIGURAÇÃO: MongoDB URI inválida ou não definida", {
    uri: uri ? uri.substring(0, 10) + "..." : "undefined",
  })
}

// Função para criar um cliente MongoDB
export async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri)
    await client.connect()
    return client
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error)
    throw error
  }
}

// Função para obter uma instância do banco de dados
export async function getDatabase() {
  const client = await connectToMongoDB()
  return {
    db: client.db("dynamicpro"),
    client,
  }
}

