import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { connectToMongoDB, closeConnection } from "@/lib/mongodb-config"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Conectar ao MongoDB
    const { db } = await connectToMongoDB()

    // Verificar se a coleção users já existe
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    // Criar a coleção users se não existir
    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      console.log("Coleção 'users' criada com sucesso")
    }

    // Criar índice único para email
    await db.collection("users").createIndex({ email: 1 }, { unique: true })

    // Criar usuário admin se não existir
    const adminUser = await db.collection("users").findOne({ email: "admin@dynamicpro.com" })

    if (!adminUser) {
      const hashedPassword = await hash("admin123", 10)

      await db.collection("users").insertOne({
        name: "Administrador",
        email: "admin@dynamicpro.com",
        password: hashedPassword,
        role: "admin",
        formation: "Administração",
        disciplines: ["Todas"],
        createdAt: new Date(),
      })

      console.log("Usuário admin criado com sucesso")
    }

    return NextResponse.json({
      success: true,
      message: "Banco de dados inicializado com sucesso",
      collections: collectionNames,
      admin_user: adminUser ? "já existe" : "criado",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    // Fechar a conexão após a inicialização
    await closeConnection()
  }
}

