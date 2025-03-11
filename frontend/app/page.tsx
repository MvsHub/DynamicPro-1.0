"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>("Verificando...")

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data) => setApiStatus(data.message))
      .catch((error) => setApiStatus("Erro ao conectar com API"))
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Bem-vindo ao Dynamic Pro 1.0</h1>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A plataforma interativa onde professores e alunos podem compartilhar conhecimento, gerenciar conteúdos e
            colaborar em um ambiente dinâmico e intuitivo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/registro">Criar Conta</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">Status da API: {apiStatus}</div>
        </div>
      </div>
    </main>
  )
}

