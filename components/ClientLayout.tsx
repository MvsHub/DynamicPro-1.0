"use client"

import type React from "react"
import { AuthProvider } from "@/hooks/useAuth"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

