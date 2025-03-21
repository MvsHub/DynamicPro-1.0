import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeSystem as ThemeProvider } from "@/components/theme-system"
import ClientLayout from "@/components/ClientLayout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dynamic Pro - Plataforma de Ensino",
  description: "Plataforma de ensino dinâmica para alunos e professores",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}










