import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { connectToMongoDB } from "@/lib/mongodb-serverless"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Reduzir o timeout para evitar FUNCTION_INVOCATION_TIMEOUT
export const maxDuration = 5 // 5 segundos

export async function GET() {
  const startTime = Date.now()
  let client = null

  try {
    // Conectar ao MongoDB
    client = await connectToMongoDB()
    const db = client.db("dynamicpro")

    // Verificar se a coleção users existe
    const collections = await db.listCollections().toArray()
    const hasUsersCollection = collections.some((col) => col.name === "users")

    // Criar coleção users se não existir
    if (!hasUsersCollection) {
      await db.createCollection("users")
    }

    // Verificar se já existe um usuário admin
    const usersCollection = db.collection("users")
    const adminUser = await usersCollection.findOne({ email: "admin@dynamicpro.com" })

    if (!adminUser) {
      // Criar usuário admin
      const hashedPassword = await hash("admin123", 10)
      await usersCollection.insertOne({
        name: "Administrador",
        email: "admin@dynamicpro.com",
        password: hashedPassword,
        role: "teacher",
        formation: "Administração",
        disciplines: ["Administração", "Gestão"],
        createdAt: new Date(),
      })
    }

    // Verificar se já existe um usuário aluno
    const studentUser = await usersCollection.findOne({ email: "aluno@dynamicpro.com" })

    if (!studentUser) {
      // Criar usuário aluno
      const hashedPassword = await hash("aluno123", 10)
      await usersCollection.insertOne({
        name: "Aluno Teste",
        email: "aluno@dynamicpro.com",
        password: hashedPassword,
        role: "student",
        formation: "Estudante",
        disciplines: [],
        createdAt: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Banco de dados inicializado com sucesso",
      time_ms: Date.now() - startTime,
      users_created: {
        admin: !adminUser,
        student: !studentUser,
      },
    })
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Falha ao inicializar banco de dados",
        error: error instanceof Error ? error.message : String(error),
        time_ms: Date.now() - startTime,
      },
      { status: 500 },
    )
  }
}



