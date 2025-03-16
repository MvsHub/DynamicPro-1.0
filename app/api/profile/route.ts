import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"
import type { User } from "@/types"

// Armazenamento em memória para perfis de usuários (apenas para desenvolvimento)
const mockProfiles: Partial<User>[] = [
  {
    id: "mock_teacher_1",
    name: "Professor Demo",
    email: "professor@dynamicpro.com",
    role: "teacher",
    formation: "Doutor em Educação",
    disciplines: ["Matemática", "Física"],
    bio: "Professor com mais de 10 anos de experiência em ensino superior.",
    profileImage: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "mock_student_1",
    name: "Aluno Demo",
    email: "aluno@dynamicpro.com",
    role: "student",
    bio: "Estudante dedicado em busca de conhecimento.",
    profileImage: "/placeholder.svg?height=200&width=200",
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

// GET - Obter perfil do usuário logado
export async function GET() {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  // Buscar perfil do usuário
  let userProfile = mockProfiles.find((profile) => profile.id === usuario!.id)

  // Se não encontrar, criar um perfil básico
  if (!userProfile) {
    userProfile = {
      id: usuario!.id,
      name: usuario!.email.split("@")[0],
      email: usuario!.email,
      role: usuario!.role as "teacher" | "student",
      bio: "",
      profileImage: "/placeholder.svg?height=200&width=200",
    }

    // Adicionar ao armazenamento mock
    mockProfiles.push(userProfile)
  }

  return NextResponse.json({
    data: userProfile,
    mock: true,
  })
}

// PUT - Atualizar perfil do usuário logado
export async function PUT(request: Request) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    const { name, bio, formation, profileImage } = await request.json()

    // Buscar perfil do usuário
    const profileIndex = mockProfiles.findIndex((profile) => profile.id === usuario!.id)

    // Se não encontrar, criar um novo perfil
    if (profileIndex === -1) {
      const newProfile: Partial<User> = {
        id: usuario!.id,
        name: name || usuario!.email.split("@")[0],
        email: usuario!.email,
        role: usuario!.role as "teacher" | "student",
        bio: bio || "",
        formation: usuario!.role === "teacher" ? formation || "" : undefined,
        profileImage: profileImage || "/placeholder.svg?height=200&width=200",
      }

      mockProfiles.push(newProfile)

      return NextResponse.json({
        data: newProfile,
        message: "Perfil criado com sucesso",
        mock: true,
      })
    }

    // Atualizar perfil existente
    const updatedProfile = {
      ...mockProfiles[profileIndex],
      name: name || mockProfiles[profileIndex].name,
      bio: bio !== undefined ? bio : mockProfiles[profileIndex].bio,
      formation:
        usuario!.role === "teacher"
          ? formation !== undefined
            ? formation
            : mockProfiles[profileIndex].formation
          : undefined,
      profileImage: profileImage || mockProfiles[profileIndex].profileImage,
    }

    mockProfiles[profileIndex] = updatedProfile

    return NextResponse.json({
      data: updatedProfile,
      message: "Perfil atualizado com sucesso",
      mock: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar perfil",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

