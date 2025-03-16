import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"

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

// POST - Curtir/descurtir um post
export async function POST(request: Request, { params }: { params: { id: string } }) {
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

  // Verificar se o usuário já curtiu o post
  const post = mockPosts[postIndex]
  const likedBy = post.likedBy || []
  const userIndex = likedBy.indexOf(usuario!.id)

  // Se o usuário já curtiu, remover curtida
  if (userIndex !== -1) {
    likedBy.splice(userIndex, 1)
    post.likes = Math.max(0, post.likes - 1)
  }
  // Caso contrário, adicionar curtida
  else {
    likedBy.push(usuario!.id)
    post.likes = (post.likes || 0) + 1
  }

  // Atualizar post
  mockPosts[postIndex] = {
    ...post,
    likedBy,
  }

  return NextResponse.json({
    data: mockPosts[postIndex],
    liked: userIndex === -1, // true se curtiu, false se descurtiu
    message: userIndex === -1 ? "Post curtido com sucesso" : "Curtida removida com sucesso",
    mock: true,
  })
}

