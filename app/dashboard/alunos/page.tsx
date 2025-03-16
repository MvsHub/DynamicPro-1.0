"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AlunosPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  // Redirecionar se não for professor
  if (user.role !== "teacher") {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Meus Alunos</h1>
      </header>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Alunos Matriculados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Nenhum aluno matriculado no momento.</p>
        </CardContent>
      </Card>
    </div>
  )
}

