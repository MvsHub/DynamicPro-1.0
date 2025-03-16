"use client"

import Link from "next/link"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, ClipboardList } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCursos: 0,
    totalAlunos: 0,
    atividadesPendentes: 0,
  })

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Bem-vindo, {user.name}. {user.role === "teacher" ? "Área do Professor" : "Área do Aluno"}
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total de Cursos</CardTitle>
            <BookOpen className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCursos}</div>
            <p className="text-sm text-gray-400 mt-1">
              {user.role === "teacher" ? "Cursos que você ministra" : "Cursos matriculados"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Total de Alunos</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAlunos}</div>
            <p className="text-sm text-gray-400 mt-1">Alunos matriculados</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Atividades Pendentes</CardTitle>
            <ClipboardList className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.atividadesPendentes}</div>
            <p className="text-sm text-gray-400 mt-1">Atividades para avaliar</p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Área do {user.role === "teacher" ? "Professor" : "Aluno"}</h2>
          <p className="text-gray-400 mb-4">
            {user.role === "teacher"
              ? "Gerencie seus cursos, alunos e atividades."
              : "Acesse seus cursos, atividades e acompanhe seu progresso."}
          </p>
          <div className="border-t border-gray-800 pt-4">
            <h3 className="font-medium mb-2">Acesso Rápido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Link href="/dashboard/cursos" className="text-primary hover:underline">
                {user.role === "teacher" ? "Gerenciar Cursos" : "Meus Cursos"}
              </Link>
              {user.role === "teacher" && (
                <Link href="/dashboard/alunos" className="text-primary hover:underline">
                  Gerenciar Alunos
                </Link>
              )}
              <Link href="/dashboard/configuracoes" className="text-primary hover:underline">
                Configurações
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Nenhuma atividade recente encontrada.</p>
        </CardContent>
      </Card>
    </div>
  )
}





