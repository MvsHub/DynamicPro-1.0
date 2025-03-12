"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth" // Remove .tsx extension

interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
}

interface DashboardNavProps {
  items: NavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const navItems = items.filter((item) => {
    // Filtrar itens baseado no papel do usuário
    if (item.href.includes("/teacher") && user.role !== "teacher") {
      return false
    }
    if (item.href.includes("/student") && user.role !== "student") {
      return false
    }
    return true
  })

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            )}
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </Button>
        </Link>
      ))}
    </nav>
  )
}

