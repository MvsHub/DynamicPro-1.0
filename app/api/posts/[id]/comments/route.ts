import { NextResponse } from "next/server"
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

export async function GET(request: Request, { params }: { params: { id: string } }) {
const id = params.id

try {
  // Filtrar comentários pelo ID do post
  const comentarios = mockComments.filter((comment) => comment.postId === id)

  return NextResponse.json(comentarios)
} catch (error) {
  console.error("Erro ao buscar comentários:", error)
  return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
}
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
const id = params.id

try {
  const { content } = await request.json()

  if (!content) {
    return NextResponse.json({ erro: "Conteúdo é obrigatório" }, { status: 400 })
  }

  // Criar novo comentário
  const novoComentario = {
    id: `comment_${Date.now()}`,
    postId: id,
    content,
    authorId: "user_temp",
    authorName: "Usuário Temporário",
    authorRole: "student",
    createdAt: new Date().toISOString(),
  }

  // Em um ambiente real, salvaríamos no banco de dados
  mockComments.push(novoComentario)

  return NextResponse.json(novoComentario, { status: 201 })
} catch (error) {
  console.error("Erro ao criar comentário:", error)
  return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
}
}