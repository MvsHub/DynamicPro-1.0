"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

// Componente de layout para o dashboard
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">DP</span>
            </div>
            <span className="text-xl font-bold">Dynamic Pro</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive("/dashboard") &&
                    !isActive("/dashboard/feed") &&
                    !isActive("/dashboard/cursos") &&
                    !isActive("/dashboard/alunos") &&
                    !isActive("/dashboard/configuracoes") &&
                    !isActive("/dashboard/perfil")
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/feed"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive("/dashboard/feed")
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )}
              >
                <MessageSquare size={20} />
                <span>Feed</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/cursos"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive("/dashboard/cursos")
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )}
              >
                <BookOpen size={20} />
                <span>Meus Cursos</span>
              </Link>
            </li>
            {user?.role === "teacher" && (
              <li>
                <Link
                  href="/dashboard/alunos"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                    isActive("/dashboard/alunos")
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                  )}
                >
                  <Users size={20} />
                  <span>Alunos</span>
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/dashboard/perfil"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive("/dashboard/perfil")
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )}
              >
                <User size={20} />
                <span>Meu Perfil</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/configuracoes"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  isActive("/dashboard/configuracoes")
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )}
              >
                <Settings size={20} />
                <span>Configurações</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            className="flex items-center space-x-3 px-3 py-2 w-full text-left rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            onClick={logout}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6 overflow-auto">{children}</main>
    </div>
  )
}



