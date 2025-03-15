import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
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
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Dynamic Pro</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          Plataforma de ensino dinâmica para alunos e professores, transformando a maneira como você aprende e ensina.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 font-medium">
              Entrar
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Registrar
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© 2024 Dynamic Pro. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Termos
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}




