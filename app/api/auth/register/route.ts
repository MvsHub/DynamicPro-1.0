import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { connectToMongoDB } from "@/lib/mongodb-config"

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const { name, email, password, role, formation, disciplines } = await request.json()

    // Validar campos obrigatórios
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Nome, email, senha e função são obrigatórios" }, { status: 400 })
    }

    try {
      // Conectar ao MongoDB usando a configuração segura
      const { db } = await connectToMongoDB()
      const usersCollection = db.collection("users")

      // Verificar se o email já está em uso
      const existingUser = await usersCollection.findOne({ email })

      if (existingUser) {
        return NextResponse.json({ message: "Email já cadastrado" }, { status: 409 })
      }

      // Criptografar senha
      const hashedPassword = await hash(password, 10)

      // Inserir usuário
      const result = await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        role,
        formation: formation || "",
        disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
        createdAt: new Date(),
      })

      // Gerar token JWT
      const token = sign(
        {
          id: result.insertedId.toString(),
          email,
          role,
        },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" },
      )

      // Retornar token e dados do usuário
      return NextResponse.json({
        token,
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          role,
          formation: formation || "",
          disciplines: Array.isArray(disciplines) ? disciplines : disciplines ? [disciplines] : [],
        },
      })
    } catch (dbError) {
      console.error("Erro ao conectar ou operar no MongoDB:", dbError)
      return NextResponse.json(
        {
          message: "Erro de conexão com o banco de dados",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao processar registro:", error)
    return NextResponse.json(
      {
        message: "Erro ao processar registro",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}






