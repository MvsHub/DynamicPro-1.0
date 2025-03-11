import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Dynamic Pro 1.0</CardTitle>
          <CardDescription>Plataforma interativa para professores e alunos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center">Bem-vindo à nossa plataforma educacional inovadora!</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/registro">Registro</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}