"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"

export default function RegisterPage() {
  const [userType, setUserType] = useState<"student" | "teacher">("student")
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
    formation: "",
    profession: "",
    subject: "",
  })
  const { register, loading, error } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      setStep(2)
      return
    }

    const success = await register(formData, userType)
    if (success) {
      router.push("/dashboard")
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
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Crie sua conta</h1>
            <p className="mt-2 text-muted-foreground">Registre-se no Dynamic Pro para ter acesso à plataforma</p>
          </div>

          <Card>
            <Tabs
              value={userType}
              onValueChange={(value) => setUserType(value as "student" | "teacher")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student">Aluno</TabsTrigger>
                <TabsTrigger value="teacher">Professor</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  {step === 1 ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="course">Curso</Label>
                        <Input id="course" value={formData.course} onChange={handleChange} required />
                      </div>
                    </div>
                  )}

                  {error && <div className="text-sm text-destructive">{error}</div>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processando..." : step === 1 ? "Próximo" : "Finalizar Registro"}
                  </Button>

                  <div className="text-center text-sm">
                    <Link href="/login" className="text-primary hover:underline">
                      Já tem uma conta? Entre aqui
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="teacher">
                <form onSubmit={handleSubmit} className="space-y-4 p-6">
                  {step === 1 ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="formation">Formação</Label>
                        <Input id="formation" value={formData.formation} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Disciplinas</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Ex: Matemática, Física"
                        />
                      </div>
                    </div>
                  )}

                  {error && <div className="text-sm text-destructive">{error}</div>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processando..." : step === 1 ? "Próximo" : "Finalizar Registro"}
                  </Button>

                  <div className="text-center text-sm">
                    <Link href="/login" className="text-primary hover:underline">
                      Já tem uma conta? Entre aqui
                    </Link>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  )
}


