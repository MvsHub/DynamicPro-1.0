"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState("student")
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Aqui iremos adicionar a lógica de registro posteriormente
    setTimeout(() => {
      setIsLoading(false)
      // Simular mudança de passo ou finalização do registro
      if (step === 1) {
        setStep(2)
      } else {
        // Redirecionar ou mostrar mensagem de sucesso
        console.log("Registro concluído")
      }
    }, 1000)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">Voltar</Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
          <p className="text-sm text-muted-foreground">Registre-se no Dynamic Pro para ter acesso à plataforma</p>
        </div>

        <Tabs value={userType} onValueChange={setUserType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Aluno</TabsTrigger>
            <TabsTrigger value="teacher">Professor</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Aluno</CardTitle>
                  <CardDescription>Crie sua conta de aluno no Dynamic Pro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" required />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="course">Curso</Label>
                      <Input id="course" required />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Processando..." : step === 1 ? "Próximo" : "Finalizar Registro"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="teacher">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Professor</CardTitle>
                  <CardDescription>Crie sua conta de professor no Dynamic Pro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name-teacher">Nome completo</Label>
                        <Input id="name-teacher" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email-teacher">Email</Label>
                        <Input id="email-teacher" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-teacher">Senha</Label>
                        <Input id="password-teacher" type="password" required />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="formation">Formação</Label>
                        <Input id="formation" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="profession">Cargo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="coordenador">Coordenador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Disciplina</Label>
                        <Textarea id="subject" placeholder="Descreva as disciplinas que leciona" />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Processando..." : step === 1 ? "Próximo" : "Finalizar Registro"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}

