"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistroPage() {
  const router = useRouter()
  const { register, error } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [formation, setFormation] = useState("")
  const [disciplines, setDisciplines] = useState("")
  const [loading, setLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setRegistrationError(null)

    try {
      // Log para depuração
      console.log("Enviando dados de registro:", { name, email, password, role, formation, disciplines })

      const disciplinesArray = disciplines
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      const success = await register(
        {
          name,
          email,
          password,
          formation,
          disciplines: disciplinesArray,
        },
        role,
      )

      if (success) {
        router.push("/dashboard")
      } else {
        setRegistrationError(error || "Ocorreu um erro ao tentar registrar")
      }
    } catch (err) {
      console.error("Erro ao registrar:", err)
      setRegistrationError("Ocorreu um erro ao tentar registrar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="text-lg font-bold text-primary-foreground">DP</span>
              </div>
              <span className="text-2xl font-bold">Dynamic Pro</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Crie sua conta</CardTitle>
            <CardDescription>Registre-se no Dynamic Pro para ter acesso à plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Movido para o topo do formulário */}
                <Tabs defaultValue="student" onValueChange={(value) => setRole(value as "student" | "teacher")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Aluno</TabsTrigger>
                    <TabsTrigger value="teacher">Professor</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div>
                  <Input
                    type="text"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Formação</label>
                  <Input
                    type="text"
                    placeholder="Adm Test Formação"
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Disciplinas</label>
                  <Input
                    type="text"
                    placeholder="Adm Test Disciplina"
                    value={disciplines}
                    onChange={(e) => setDisciplines(e.target.value)}
                  />
                </div>

                {registrationError && (
                  <div className="p-3 text-sm border border-red-500 bg-red-50 text-red-600 rounded-md">
                    {registrationError}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processando..." : "Finalizar Registro"}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <span>Já tem uma conta? </span>
              <Link href="/login" className="text-primary hover:underline">
                Entre aqui
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}




