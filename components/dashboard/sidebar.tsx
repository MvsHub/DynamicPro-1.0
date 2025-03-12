"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  const isTeacher = user.role === "teacher"

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    ...(isTeacher
      ? [
          {
            title: "Meus Cursos",
            href: "/dashboard/cursos",
            icon: <BookOpen className="h-5 w-5" />,
          },
          {
            title: "Alunos",
            href: "/dashboard/alunos",
            icon: <Users className="h-5 w-5" />,
          },
        ]
      : [
          {
            title: "Cursos Disponíveis",
            href: "/dashboard/cursos",
            icon: <BookOpen className="h-5 w-5" />,
          },
          {
            title: "Meus Professores",
            href: "/dashboard/professores",
            icon: <GraduationCap className="h-5 w-5" />,
          },
        ]),
    {
      title: "Configurações",
      href: "/dashboard/configuracoes",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">DP</span>
            </div>
            <span className="text-xl font-bold">Dynamic Pro</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.role === "student" ? "Aluno" : "Professor"}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="ml-auto" title="Sair">
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

