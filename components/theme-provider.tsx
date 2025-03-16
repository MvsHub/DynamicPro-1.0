"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

export function ThemeSystem({
  children,
  ...props
}: {
  children: React.ReactNode
} & React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}