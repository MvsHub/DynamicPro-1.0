import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verify } from "jsonwebtoken"

// Referência ao armazenamento mock de cursos
// Na prática, isso seria importado do arquivo anterior ou de um serviço centralizado
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

// Função para verificar autenticação (mesma do arquivo anterior)
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

// POST - Matricular aluno em curso
export async function POST(request: Request) {
  const { autenticado, usuario } = await verificarAutenticacao()

  if (!autenticado) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  try {
    const { cursoId, alunoId } = await request.json()

    if (!cursoId || !alunoId) {
      return NextResponse.json({ message: "ID do curso e do aluno são obrigatórios" }, { status: 400 })
    }

    // Encontrar o curso
    const cursoIndex = mockCursos.findIndex((curso) => curso.id === cursoId)

    if (cursoIndex === -1) {
      return NextResponse.json({ message: "Curso não encontrado" }, { status: 404 })
    }

    // Verificar permissão (apenas professores do curso podem matricular alunos)
    if (usuario?.role === "teacher" && mockCursos[cursoIndex].professorId !== usuario.id) {
      return NextResponse.json(
        { message: "Você não tem permissão para matricular alunos neste curso" },
        { status: 403 },
      )
    }

    // Verificar se o aluno já está matriculado
    const alunoJaMatriculado = mockCursos[cursoIndex].alunos.some((aluno: any) => aluno.id === alunoId)

    if (alunoJaMatriculado) {
      return NextResponse.json({ message: "Aluno já matriculado neste curso" }, { status: 400 })
    }

    // Adicionar aluno ao curso
    mockCursos[cursoIndex].alunos.push({
      id: alunoId,
      nome: `Aluno ${alunoId}`,
      matriculadoEm: new Date().toISOString(),
    })

    return NextResponse.json({
      message: "Aluno matriculado com sucesso",
      curso: mockCursos[cursoIndex],
      mock: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao matricular aluno",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

