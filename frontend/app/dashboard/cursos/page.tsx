"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function CoursesPage() {
  const { user } = useAuth()

  if (!user) return null

  const isTeacher = user.role === "teacher"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{isTeacher ? "Meus Cursos" : "Cursos Disponíveis"}</h1>
        {isTeacher && (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Curso
          </Button>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted" />
            <CardHeader>
              <CardTitle>Curso de Exemplo {i + 1}</CardTitle>
              <CardDescription>{isTeacher ? "Criado em 01/01/2024" : "Professor: João Silva"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {isTeacher ? "Gerenciar Curso" : "Ver Detalhes"}
              </Button>
            </CardFooter>
          </Card>
        ))}

        {isTeacher && (
          <Card className="flex flex-col items-center justify-center p-6 border-dashed">
            <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">Criar um novo curso</p>
            <Button variant="outline">Começar</Button>
          </Card>
        )}
      </div>
    </div>
  )
}

