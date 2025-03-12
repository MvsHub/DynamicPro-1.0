"use client"

import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, GraduationCap, Users } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const isTeacher = user.role === "teacher"

  const stats = [
    {
      title: isTeacher ? "Total de Cursos" : "Cursos Matriculados",
      value: "0",
      description: isTeacher ? "Cursos que você ministra" : "Cursos em andamento",
      icon: <BookOpen className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: isTeacher ? "Total de Alunos" : "Atividades Pendentes",
      value: "0",
      description: isTeacher ? "Alunos matriculados" : "Atividades para completar",
      icon: isTeacher ? (
        <Users className="h-5 w-5 text-muted-foreground" />
      ) : (
        <Calendar className="h-5 w-5 text-muted-foreground" />
      ),
    },
    {
      title: isTeacher ? "Atividades Pendentes" : "Professores",
      value: "0",
      description: isTeacher ? "Atividades para avaliar" : "Seus professores atuais",
      icon: isTeacher ? (
        <Calendar className="h-5 w-5 text-muted-foreground" />
      ) : (
        <GraduationCap className="h-5 w-5 text-muted-foreground" />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Bem-vindo, {user.name}</CardTitle>
            <CardDescription>{isTeacher ? "Área do Professor" : "Área do Aluno"}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {isTeacher
                ? "Aqui você pode gerenciar seus cursos, alunos e atividades."
                : "Aqui você pode acessar seus cursos, atividades e materiais de estudo."}
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Suas últimas atividades na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Nenhuma atividade recente encontrada.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}




