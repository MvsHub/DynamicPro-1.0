import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold">
          Dynamic Pro
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </li>
            <li>
              <Button variant="secondary" asChild>
                <Link href="/registro">Registro</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}