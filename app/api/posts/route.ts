import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"
import type { Post } from "@/types"

// Armazenamento em memória para posts (apenas para desenvolvimento)
// Removida a palavra-chave 'export' daqui
const mockPosts: Post[] = [
  {
    id: "post_1",
    title: "Bem-vindo ao Dynamic Pro",
    content:
      "Esta é uma plataforma de ensino dinâmica para alunos e professores. Aqui você pode compartilhar conhecimento e interagir com outros usuários.",
    authorId: "mock_teacher_1",
    authorName: "Professor Demo",
    authorRole: "teacher",
    likes: 5,
    likedBy: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
  },
  {
    id: "post_2",
    title: "Dicas de Estudo",
    content:
      "Aqui estão algumas dicas para otimizar seus estudos: 1) Crie um cronograma, 2) Faça pausas regulares, 3) Revise o conteúdo periodicamente.",
    authorId: "mock_teacher_1",
    authorName: "Professor Demo",
    authorRole: "teacher",
    likes: 3,
    likedBy: [],
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 horas atrás
  },
]

// Configuração para forçar modo dinâmico
export const dynamic = "force-dynamic"

// Função para verificar autenticação
async function verificarAutenticacao() {
  const headersList = headers()
  const authorization = headersList.get("Authorization")

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return { autenticado: false, usuario: null }
  }

  const token = authorization.split(" ")[1]

  try {
    // Verificar token
    const decoded = verify(token, process.env.JWT_SECRET || "secret") as {
      id: string
      email: string
      role: string
    }

    return {
      autenticado: true,
      usuario: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    }
  } catch (error) {
    return { autenticado: false, usuario: null }
  }
}

// GET - Listar posts
export async function GET() {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  // Ordenar posts do mais recente para o mais antigo
  const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({
    data: sortedPosts,
    mock: true,
  })
}

// POST - Criar novo post
export async function POST(request: Request) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  // Apenas professores podem criar posts
  if (usuario?.role !== "teacher") {
    return NextResponse.json({ message: "Apenas professores podem criar posts" }, { status: 403 })
  }

  try {
    const { title, content, images } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "Título e conteúdo são obrigatórios" }, { status: 400 })
    }

    // Criar novo post
    const newPost: Post = {
      id: `post_${Date.now()}`,
      title,
      content,
      authorId: usuario.id,
      authorName: usuario.email.split("@")[0],
      authorRole: usuario.role as "teacher" | "student",
      images: images || [],
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao armazenamento mock
    mockPosts.push(newPost)

    return NextResponse.json({
      data: newPost,
      message: "Post criado com sucesso",
      mock: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao criar post",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}


