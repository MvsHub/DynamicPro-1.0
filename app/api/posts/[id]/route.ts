import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"
import type { Post } from "@/types"

// Referência ao armazenamento mock de posts
import { mockPosts } from "@/app/api/posts/route"

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

// GET - Obter um post específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { autenticado } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const postId = params.id

  // Buscar post pelo ID
  const post = mockPosts.find((p) => p.id === postId)

  if (!post) {
    return NextResponse.json({ message: "Post não encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    data: post,
    mock: true,
  })
}

// PUT - Atualizar um post
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const postId = params.id

  // Buscar post pelo ID
  const postIndex = mockPosts.findIndex((p) => p.id === postId)

  if (postIndex === -1) {
    return NextResponse.json({ message: "Post não encontrado" }, { status: 404 })
  }

  // Verificar se o usuário é o autor do post
  if (mockPosts[postIndex].authorId !== usuario?.id) {
    return NextResponse.json({ message: "Você não tem permissão para editar este post" }, { status: 403 })
  }

  try {
    const { title, content, images } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ message: "Título e conteúdo são obrigatórios" }, { status: 400 })
    }

    // Atualizar post
    const updatedPost: Post = {
      ...mockPosts[postIndex],
      title,
      content,
      images: images || [],
      updatedAt: new Date().toISOString(),
    }

    mockPosts[postIndex] = updatedPost

    return NextResponse.json({
      data: updatedPost,
      message: "Post atualizado com sucesso",
      mock: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar post",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE - Excluir um post
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const postId = params.id

  // Buscar post pelo ID
  const postIndex = mockPosts.findIndex((p) => p.id === postId)

  if (postIndex === -1) {
    return NextResponse.json({ message: "Post não encontrado" }, { status: 404 })
  }

  // Verificar se o usuário é o autor do post
  if (mockPosts[postIndex].authorId !== usuario?.id) {
    return NextResponse.json({ message: "Você não tem permissão para excluir este post" }, { status: 403 })
  }

  // Remover post
  mockPosts.splice(postIndex, 1)

  return NextResponse.json({
    message: "Post excluído com sucesso",
    mock: true,
  })
}


