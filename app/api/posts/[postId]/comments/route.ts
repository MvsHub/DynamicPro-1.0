import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"
import type { Comment } from "@/types"

// Armazenamento em memória para comentários (apenas para desenvolvimento)
const mockComments: Comment[] = [
  {
    id: "comment_1",
    postId: "post_1",
    content: "Excelente post! Muito informativo.",
    authorId: "mock_student_1",
    authorName: "Aluno Demo",
    authorRole: "student",
    createdAt: new Date().toISOString(),
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

// GET - Listar comentários de um post
export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const { autenticado } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const postId = params.postId

  // Filtrar comentários pelo postId
  const postComments = mockComments.filter((comment) => comment.postId === postId)

  // Ordenar comentários do mais antigo para o mais recente
  const sortedComments = [...postComments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  return NextResponse.json({
    data: sortedComments,
    mock: true,
  })
}

// POST - Adicionar comentário a um post
export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const postId = params.postId

  try {
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ message: "Conteúdo do comentário é obrigatório" }, { status: 400 })
    }

    // Criar novo comentário
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      content,
      authorId: usuario!.id,
      authorName: usuario!.email.split("@")[0],
      authorRole: usuario!.role as "teacher" | "student",
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao armazenamento mock
    mockComments.push(newComment)

    return NextResponse.json({
      data: newComment,
      message: "Comentário adicionado com sucesso",
      mock: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao adicionar comentário",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

