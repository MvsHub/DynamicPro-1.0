"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfiguracoesPage() {
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

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Configurações</h1>
      </header>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Nome</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Função</p>
              <p>{user.role === "teacher" ? "Professor" : "Aluno"}</p>
            </div>
            {user.formation && (
              <div>
                <p className="text-sm text-gray-400">Formação</p>
                <p>{user.formation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

