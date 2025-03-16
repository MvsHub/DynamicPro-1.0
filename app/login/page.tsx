"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { login, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError(null)

    try {
      const success = await login(email, password, role)
      if (!success) {
        setLoginError(error || "Falha ao fazer login")
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      setLoginError("Ocorreu um erro ao tentar fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800">
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
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="text-gray-400">Entre com suas credenciais para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Tabs defaultValue="student" onValueChange={(value) => setRole(value as "student" | "teacher")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="student">Aluno</TabsTrigger>
                    <TabsTrigger value="teacher">Professor</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processando..." : "Entrar"}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-gray-400">Não tem uma conta? </span>
              <Link href="/registro" className="text-primary hover:underline">
                Registre-se aqui
              </Link>
            </div>

            <div className="mt-6 p-3 bg-gray-800 rounded-md text-xs text-gray-400">
              <p className="font-medium mb-1">Credenciais de teste:</p>
              <p>Email: qualquer email</p>
              <p>Senha: qualquer senha</p>
              <p>Selecione o tipo de usuário (Aluno/Professor) para acessar a área correspondente.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}






