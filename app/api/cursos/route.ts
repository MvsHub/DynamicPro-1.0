import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"

// Armazenamento em memória para cursos (apenas para desenvolvimento)
const mockCursos: any[] = [
  {
    id: "curso_1",
    titulo: "Introdução à Programação",
    descricao: "Aprenda os fundamentos da programação com JavaScript",
    professorId: "mock_teacher_1",
    professorNome: "Professor Demo",
    alunos: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "curso_2",
    titulo: "Desenvolvimento Web Avançado",
    descricao: "Aprenda técnicas avançadas de desenvolvimento web com React e Next.js",
    professorId: "mock_teacher_1",
    professorNome: "Professor Demo",
    alunos: [],
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

// GET - Listar cursos
export async function GET() {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  // Filtrar cursos com base na função do usuário
  let cursosFiltrados = []

  if (usuario?.role === "teacher") {
    // Professores veem seus próprios cursos
    cursosFiltrados = mockCursos.filter((curso) => curso.professorId === usuario.id)
  } else {
    // Alunos veem cursos em que estão matriculados
    cursosFiltrados = mockCursos.filter((curso) => curso.alunos.some((aluno: any) => aluno.id === usuario?.id))
  }

  return NextResponse.json({
    cursos: cursosFiltrados,
    mock: true,
  })
}

// POST - Criar novo curso
export async function POST(request: Request) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  // Apenas professores podem criar cursos
  if (usuario?.role !== "teacher") {
    return NextResponse.json({ message: "Apenas professores podem criar cursos" }, { status: 403 })
  }

  try {
    const { titulo, descricao } = await request.json()

    if (!titulo || !descricao) {
      return NextResponse.json({ message: "Título e descrição são obrigatórios" }, { status: 400 })
    }

    // Criar novo curso
    const novoCurso = {
      id: `curso_${Date.now()}`,
      titulo,
      descricao,
      professorId: usuario.id,
      professorNome: usuario.email.split("@")[0],
      alunos: [],
      createdAt: new Date().toISOString(),
    }

    // Adicionar ao armazenamento mock
    mockCursos.push(novoCurso)

    return NextResponse.json({
      curso: novoCurso,
      message: "Curso criado com sucesso",
      mock: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao criar curso",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

