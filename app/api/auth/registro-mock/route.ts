import { NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb-serverless"

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json()

    // Validação básica
    if (!nome || !email || !senha) {
      return NextResponse.json({ erro: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Verificar se o email já está em uso
    const users = await getCollection("users")
    const usuarioExistente = await users.findOne({ email })

    if (usuarioExistente) {
      return NextResponse.json({ erro: "Email já está em uso" }, { status: 409 })
    }

    // Em um ambiente real, você deve fazer hash da senha
    // Aqui estamos apenas simulando para fins de demonstração
    const novoUsuario = {
      nome,
      email,
      senha: `hashed_${senha}`, // Simulação de hash
      role: "student",
      createdAt: new Date().toISOString(),
    }

    // Inserir o usuário no banco de dados
    const resultado = await users.insertOne(novoUsuario)

    // Retornar resposta de sucesso (sem a senha)
    const { senha: _, ...usuarioSemSenha } = novoUsuario

    return NextResponse.json(
      {
        mensagem: "Usuário registrado com sucesso",
        usuario: {
          ...usuarioSemSenha,
          id: resultado.insertedId,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}


