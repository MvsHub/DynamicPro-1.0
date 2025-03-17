'use client'

import type React from "react"
import { AuthProvider } from "@/hooks/useAuth"
import { ToastProvider } from "@/components/ui/toast-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}

